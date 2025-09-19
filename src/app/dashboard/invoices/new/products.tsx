"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { capitalizeWords } from "@/lib/helpers/forms";
import { MetaTypes } from "@/lib/types/api";
import { InvoiceItem } from "@/lib/types/invoices";
import { ProductDataTypes, ProductsApiResponseTypes } from "@/lib/types/products";
import { Package, PlusCircle, Trash } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";


export default function ProductsInvoice() {
    const { toast } = useToast();
    const [products, setProducts] = useState<ProductDataTypes[]>([]);
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [productIdToAdd, setProductIdToAdd] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [meta, setMeta] = useState<MetaTypes>({
        page: 1,
        limit: 10,
        total: 0,
    });

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
                    limit: meta.limit,
                    q: query || undefined,
                },
            });
            setProducts((prev) =>
                currentPage === 1 || (query && query.length > 0)
                    ? response.data.results || []
                    : [...prev, ...(response.data.results || [])]
            );
            setMeta(response.data.meta || { page: 1, limit: meta.limit, total: 0 });
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
    }, [currentPage]);

    const availableProducts = products.filter(
        (p) => !items.some((item) => item.id === p.id)
    );

    const handleAddProduct = () => {
        if (!productIdToAdd) {
            toast({ title: "Please select a product to add.", variant: "destructive" });
            return;
        }
        const productToAdd = products.find((p) => p.id === productIdToAdd);
        if (productToAdd) {
            setItems([...items, { ...productToAdd, ordered_quantity: 1 }]);
            setProductIdToAdd("");
        }
    };

    const handleQuantityChange = (productId: string, quantity: number) => {
        setItems(
            items.map((item) =>
                item.id === productId
                    ? { ...item, ordered_quantity: isNaN(quantity) || quantity < 0 ? 0 : quantity }
                    : item
            )
        );
    };

    const handleRemoveItem = (productId: string) => {
        setItems(items.filter((item) => item.id !== productId));
    };

    const handleLoadMoreProducts = () => {
        if (products.length < meta.total) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-2/5">Product Name</TableHead>
                            <TableHead className="w-2/5">Product SKU</TableHead>
                            {/* <TableHead>Available Stock</TableHead> */}
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {capitalizeWords(item.name)}
                                    <div className="text-xs text-muted-foreground">
                                        Available Stock: {item.stock_quantity}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{item.sku}</TableCell>
                                <TableCell>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={item.ordered_quantity === 0 ? "" : item.ordered_quantity}
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            if (val === "") {
                                                handleQuantityChange(item.id, 0);
                                                return;
                                            }

                                            const parsed = parseInt(val, 10);

                                            if (!isNaN(parsed)) {
                                                handleQuantityChange(item.id, parsed);
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const parsed = parseInt(e.target.value, 10);
                                            if (isNaN(parsed) || parsed < 0) {
                                                handleQuantityChange(item.id, 0);
                                            }
                                        }}
                                        className={`w-20 ${item.ordered_quantity > item.stock_quantity ? "border-red-500 border-2" : ""}`}
                                    />
                                </TableCell>


                                <TableCell className="text-right">₹{item.unit_price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    ₹{(item.unit_price * item.ordered_quantity).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleRemoveItem(item.id)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No items added yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="mt-4 flex items-center gap-2">
                    <Select value={productIdToAdd} onValueChange={setProductIdToAdd}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                            <div className="p-2">
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>

                            {isLoading ? (
                                <div className="space-y-2 p-2">
                                    {[...Array(meta.limit)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-full rounded-md" />
                                    ))}
                                </div>
                            ) : availableProducts.length > 0 ? (
                                Array.from(new Map(availableProducts.map((p) => [p.id, p])).values()).map(
                                    (product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {capitalizeWords(product.name)}
                                        </SelectItem>
                                    )
                                )
                            ) : (
                                <div className="p-4 text-center text-sm text-muted-foreground space-y-2">
                                    <div className="flex justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground/60" />
                                    </div>
                                    <p>No products found</p>
                                </div>
                            )}

                            {products.length < meta.total && availableProducts.length > 0 && (
                                <div className="flex items-center justify-center p-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLoadMoreProducts}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? "Loading..." : "Load more products"}
                                    </Button>
                                </div>
                            )}
                        </SelectContent>
                    </Select>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddProduct}
                        disabled={!productIdToAdd}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
