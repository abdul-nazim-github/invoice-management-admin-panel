
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { ProductDataTypes, ProductDetailsApiResponseType } from "@/lib/types/products";
import {
  Barcode,
  Boxes,
  ChevronLeft,
  IndianRupee,
  Package,
  Pencil,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import { ProductForm } from "../components/product-form";
import { ProductDetailsSkeleton } from "./skeleton";

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [product, setProduct] = React.useState<ProductDataTypes>();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const getProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const response: ProductDetailsApiResponseType = await getRequest({
        url: `/api/products/${id}`,
      });
      setProduct(response.data.results);
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
    getProduct(params.id as string);
  }, [params.id, router]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return <div className="text-center text-muted-foreground">Product not found.</div>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.push("/dashboard/products")}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          {product.name}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-headline">Edit Product</DialogTitle>
                <DialogDescription>
                  Update the details of your product.
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={product}
                onSave={async (updated) => {
                  if (updated) {
                    setProduct(updated);
                    setIsFormOpen(false);
                    await getProduct(updated.id);
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Product Name */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Name</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{product.name}</div>
          </CardContent>
        </Card>

        {/* Product SKU*/}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product SKU</CardTitle>
            <Barcode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{product.sku}</div>
            <p className="text-xs text-muted-foreground">Stock Keeping Unit</p>
          </CardContent>
        </Card>

        {/* Product Price */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              ₹{product.unit_price.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">per unit</p>
          </CardContent>
        </Card>

        {/* Product Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Quantity</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              {product.stock_quantity}
            </div>
            <p className="text-xs text-muted-foreground">units available</p>
          </CardContent>
        </Card>



      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Product Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{product.description}</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 md:hidden">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline">Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of your product.
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              product={product}
              onSave={async (updated) => {
                if (updated) {
                  setProduct(updated);
                  setIsFormOpen(false);
                  await getProduct(updated.id);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
