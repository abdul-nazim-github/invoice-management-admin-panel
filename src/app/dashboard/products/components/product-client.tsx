
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { ProductForm } from "./product-form";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { MetaTypes } from "@/lib/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductDataTypes, ProductsApiResponseTypes } from "@/lib/types/products";
import { getRequest, deleteRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { ProductSkeleton } from "./product-skeleton";

export function ProductClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductDataTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDataTypes | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<MetaTypes>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const debouncedFetch = useDebounce((query: string) => {
    getProducts(query);
  }, 800);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    debouncedFetch(value);
  };

  const getProducts = async (query?: string) => {
    setIsLoading(true);
    try {
      const response: ProductsApiResponseTypes<ProductDataTypes[]> = await getRequest({
        url: "/api/products",
        params: {
          page: currentPage,
          limit: rowsPerPage,
          q: query || undefined,
        },
      });
      setProducts(response.data.results || []);
      setMeta(response.data.meta || { page: 1, limit: rowsPerPage, total: 0 });
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [currentPage, rowsPerPage]);

  const handleDelete = async (productId: string) => {
    try {
      await deleteRequest(`/api/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      });
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    }
  };
  
  const handleBulkDelete = async () => {
    try {
      await deleteRequest('/api/products', { data: { ids: selectedProductIds } });
      setProducts(products.filter(product => !selectedProductIds.includes(product.id)));
      setSelectedProductIds([]);
      toast({
        title: `${selectedProductIds.length} Products Deleted`,
        description: "The selected products have been successfully deleted.",
      });
    } catch (err: any) {
        const parsed = handleApiError(err);
        toast({
            title: parsed.title,
            description: parsed.description,
            variant: "destructive",
        });
    }
  }

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      const allProductIdsOnPage = products.map(p => p.id);
      setSelectedProductIds(Array.from(new Set([...selectedProductIds, ...allProductIdsOnPage])));
    } else {
      const pageProductIds = products.map(p => p.id);
      setSelectedProductIds(selectedProductIds.filter(id => !pageProductIds.includes(id)));
    }
  }

  const handleSelectOne = (productId: string, checked: boolean) => {
    if(checked) {
        setSelectedProductIds([...selectedProductIds, productId]);
    } else {
        setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    }
  }

  const isAllOnPageSelected = products.length > 0 && products.every(p => selectedProductIds.includes(p.id));
  const isSomeOnPageSelected = products.length > 0 && products.some(p => selectedProductIds.includes(p.id));
  const selectAllCheckedState = isAllOnPageSelected ? true : (isSomeOnPageSelected ? 'indeterminate' : false);
  const totalPages = Math.ceil(meta.total / rowsPerPage);
  const startProduct = products.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endProduct = Math.min(currentPage * rowsPerPage, meta.total);


  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  }
  const handleEdit = (product: ProductDataTypes) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };
  
  const handleFormSave = (product: ProductDataTypes | null) => {
    setIsFormOpen(false);
    if(product) {
      if(selectedProduct) {
        setProducts(products.map(p => p.id === product.id ? product : p));
      } else {
        setProducts([product, ...products]);
      }
    }
    setSelectedProduct(null);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            {selectedProductIds.length > 0 && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete ({selectedProductIds.length})
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the selected products.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkDelete}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search products..."
                className="w-full rounded-lg bg-background pl-10 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={handleSearch}
            />
            </div>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} size="sm" className="h-8 gap-1">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline">
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {selectedProduct ? "Update the details of your product." : "Fill in the details to add a new product."}
              </DialogDescription>
            </DialogHeader>
            <ProductForm product={selectedProduct} onSave={handleFormSave} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                    checked={selectAllCheckedState}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                />
              </TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading 
              ? Array.from({ length: rowsPerPage }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((product) => (
              <TableRow 
                key={product.id} 
                data-state={selectedProductIds.includes(product.id) ? "selected" : ""}
              >
                 <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                        aria-label="Select row"
                    />
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                  <div className="font-medium">{product.name}</div>
                   <div className="text-sm text-muted-foreground md:hidden">
                     ₹{product.unit_price.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                  ₹{product.unit_price.toFixed(2)}
                </TableCell>
                <TableCell className="hidden md:table-cell cursor-pointer" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                  {product.stock_quantity}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onSelect={() => router.push(`/dashboard/products/${product.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleEdit(product)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startProduct} to {endProduct} of {meta.total} products
          </div>
          <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${rowsPerPage}`}
              onValueChange={(value) => handleRowsPerPageChange(value)}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={`${rowsPerPage}`} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <span className="text-sm">{currentPage} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
