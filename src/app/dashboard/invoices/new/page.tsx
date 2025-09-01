
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customers, products } from "@/lib/data";
import type { InvoiceItem, Product, Customer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export default function NewInvoicePage() {
  const router = useRouter();
  const [items, setItems] = React.useState<InvoiceItem[]>([]);
  const [tax, setTax] = React.useState(18);
  const [discount, setDiscount] = React.useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleAddProduct = () => {
    // In a real app, this would open a product search modal
    const productToAdd = products.find(p => !items.some(i => i.product.id === p.id));
    if (productToAdd) {
      setItems([...items, { product: productToAdd, quantity: 1 }]);
    } else {
      toast({
        title: "No more products to add",
        variant: "destructive"
      });
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setItems(
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter((item) => item.product.id !== productId));
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount - discount;

  const handleSave = () => {
    toast({
        title: "Invoice Saved",
        description: "The new invoice has been successfully saved.",
    });
  }

  const handleDiscard = () => {
    router.push('/dashboard/invoices');
  };

  const handleGeneratePdf = () => {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    if (!selectedCustomer) {
        toast({
            title: "Please select a customer",
            variant: "destructive"
        });
        return;
    }
     if (items.length === 0) {
      toast({
        title: "Please add at least one item",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 105, 20, { align: "center" });

    // Company & Customer Details
    let y_pos = 40;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Pilot Inc.", 20, y_pos);
    y_pos += 6;
    doc.setFont("helvetica", "normal");
    doc.text("123 App Street, Dev City", 20, y_pos);
    y_pos += 6;
    doc.text("GST: 12ABCDE1234F1Z5", 20, y_pos);
    y_pos += 14;

    
    doc.text(`Bill To: ${selectedCustomer.name}`, 20, y_pos);
    y_pos += 6;
    doc.text(selectedCustomer.address, 20, y_pos);
    y_pos += 6;
    doc.text(selectedCustomer.email, 20, y_pos);

    doc.text(`Invoice Number: INV-006`, 190, 40, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 46, { align: "right" });

    // Table Header
    let y = 90;
    doc.setFont("helvetica", "bold");
    doc.text("Product", 20, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 150, y, { align: "right" });
    doc.text("Total", 190, y, { align: "right" });
    doc.line(20, y + 2, 190, y + 2);
    
    // Table Body
    y += 8;
    doc.setFont("helvetica", "normal");
    items.forEach(item => {
        doc.text(item.product.name, 20, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`₹${item.product.price.toFixed(2)}`, 150, y, { align: "right" });
        doc.text(`₹${(item.product.price * item.quantity).toFixed(2)}`, 190, y, { align: "right" });
        y += 7;
    });

    // Totals
    y += 5;
    doc.line(120, y, 190, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 150, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`₹${subtotal.toFixed(2)}`, 190, y, { align: "right" });
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text(`Tax (${tax}%):`, 150, y, { align: "right" });
     doc.setFont("helvetica", "normal");
    doc.text(`₹${taxAmount.toFixed(2)}`, 190, y, { align: "right" });
    y += 7;
    
    if (discount > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Discount:", 150, y, { align: "right" });
         doc.setFont("helvetica", "normal");
        doc.text(`-₹${discount.toFixed(2)}`, 190, y, { align: "right" });
        y += 7;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Total:", 150, y, { align: "right" });
    doc.text(`₹${total.toFixed(2)}`, 190, y, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 105, y + 20, { align: "center" });

    doc.save("invoice-006.pdf");
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/invoices">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          New Invoice
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          Draft
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handleDiscard}>
            Discard
          </Button>
          <Button size="sm" onClick={handleSave}>Save Invoice</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="customer">Customer</Label>
                  <Select onValueChange={setSelectedCustomerId}>
                    <SelectTrigger id="customer" aria-label="Select customer">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                    <Label>Invoice Number</Label>
                    <Input defaultValue="INV-006" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/5">Product</TableHead>
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
                    <TableRow key={item.product.id}>
                      <TableCell className="font-medium">
                        {item.product.name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product.id,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={handleAddProduct}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tax" className="flex items-center gap-2">
                  Tax (%)
                </Label>
                <Input
                  id="tax"
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
             <CardFooter>
                 <Button className="w-full" onClick={handleGeneratePdf}>Generate PDF</Button>
             </CardFooter>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" onClick={handleDiscard}>
          Discard
        </Button>
        <Button size="sm" onClick={handleSave}>Save Invoice</Button>
      </div>
    </main>
  );
}
