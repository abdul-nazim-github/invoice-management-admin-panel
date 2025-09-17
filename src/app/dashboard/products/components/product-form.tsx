
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ProductDataTypes, ProductsApiResponseTypes } from "@/lib/types/products";
import { useState } from "react";
import { cleanValues } from "@/lib/helpers/forms";
import { postRequest, putRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { ProductFormType } from "@/lib/formTypes";

const formSchema = z.object({
  name: z.string().min(2, "").max(100, "Name must be 100 characters or less."),
  sku: z.string().min(2, "").max(100, "SKU must be 100 characters or less."),
  description: z.string().max(500, "Description must be 500 characters or less.").optional(),
  unit_price: z.coerce.number().positive(""),
  stock_quantity: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
});

export function ProductForm({ product, onSave }: { product: ProductDataTypes | null, onSave: (product: ProductDataTypes | null) => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      description: product?.description || "",
      unit_price: product?.unit_price || 0,
      stock_quantity: product?.stock_quantity || 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const cleaned = cleanValues(values);
      const newOrUpdatedProduct: Partial<ProductFormType> = { ...cleaned };
      const savedProduct: ProductsApiResponseTypes<ProductDataTypes> = product
        ? await putRequest({ url: `/api/products/${product.id}`, body: newOrUpdatedProduct })
        : await postRequest({ url: "/api/products", body: newOrUpdatedProduct });
      toast({
        title: savedProduct.message,
        description: `${savedProduct.data.results.name} has been ${product ? "updated" : "created"
          }.`,
        variant: "success"
      });

      onSave(savedProduct.data.results);
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }
  const handleCancel = () => {
    onSave(null);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Cloud Service Subscription" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product SKU</FormLabel>
              <FormControl>
                <Input placeholder="e.g. P-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the product or service" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1200.00"
                    value={field.value === 0 ? "" : field.value} // allow empty input
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        field.onChange(""); // let it be empty while typing
                      } else {
                        const parsed = parseFloat(val);
                        if (!isNaN(parsed) && parsed >= 0) {
                          field.onChange(parsed);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      field.onChange(isNaN(val) ? 0 : val); // fallback to 0 on blur
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1200"
                    value={field.value === 0 ? "" : field.value} // allow empty input
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        field.onChange(""); // let it be empty while typin
                      } else {
                        const parsed = parseInt(val);
                        if (!isNaN(parsed) && parsed >= 0) {
                          field.onChange(parsed);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      field.onChange(isNaN(val) ? 0 : val); // fallback to 0 on blur
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Product</Button>
        </div>
      </form>
    </Form>
  );
}

