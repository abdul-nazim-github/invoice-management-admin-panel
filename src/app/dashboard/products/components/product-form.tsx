
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
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ProductDataTypes } from "@/lib/types/products";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name must be 100 characters or less."),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500, "Description must be 500 characters or less."),
  price: z.coerce.number().positive("Price must be a positive number.").optional(),
  stock: z.coerce.number().int().min(0, "Stock can't be negative.").optional(),
});

export function ProductForm({ product, onSave }: { product: ProductDataTypes | null, onSave: (product: ProductDataTypes | null) => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const newOrUpdatedProduct: Product = {
      id: product?.id || new Date().toISOString(), // Create a new ID for new products
      ...values,
      price: values.price || 0,
      stock: values.stock || 0
    };
    
    toast({
      title: "Product Saved",
      description: `${values.name} has been ${product ? 'updated' : 'created'}.`,
    });
    onSave(newOrUpdatedProduct);
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1200.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </Form>
  );
}

    