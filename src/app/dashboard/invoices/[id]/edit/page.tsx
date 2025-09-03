
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
import { customers, products, invoices } from "@/lib/data";
import type { InvoiceItem, Product, Customer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const invoice = invoices.find((inv) => inv.id === params.id);

  const [items, setItems] = React.useState<InvoiceItem[]>(invoice?.items || []);
  const [tax, setTax] = React.useState(invoice ? (invoice.tax / invoice.subtotal * 100) : 18);
  const [discount, setDiscount] = React.useState(invoice?.discount || 0);
  const [amountPaid, setAmountPaid] = React.useState(invoice?.amountPaid || 0);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(invoice?.customer.id || null);
  const [productIdToAdd, setProductIdToAdd] = React.useState<string>("");


   React.useEffect(() => {
    if (!invoice) {
      toast({
        title: "Invoice not found",
        variant: "destructive"
      });
      router.push('/dashboard/invoices');
    }
  }, [invoice, router, toast]);

  if (!invoice) {
    return <div>Loading...</div>; // Or a proper loading state
  }
  
  const availableProducts = products.filter(p => !items.some(item => item.product.id === p.id));


  const handleAddProduct = () => {
    if (!productIdToAdd) {
        toast({ title: "Please select a product to add.", variant: "destructive" });
        return;
    }
    const productToAdd = products.find(p => p.id === productIdToAdd);
    if (productToAdd) {
      setItems([...items, { product: productToAdd, quantity: 1 }]);
      setProductIdToAdd("");
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setItems(
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity: isNaN(quantity) || quantity < 1 ? 1 : quantity } : item
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
  const amountDue = total - amountPaid;

  const handleSave = () => {
    toast({
        title: "Invoice Updated",
        description: `Invoice ${invoice.invoiceNumber} has been successfully updated.`,
    });
    const from = searchParams.get('from');
    if (from) {
      router.push(from);
    } else {
      router.push(`/dashboard/invoices/${invoice.id}`);
    }
  }

  const handleDiscard = () => {
    router.back();
  };
  

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          Edit Invoice {invoice.invoiceNumber}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0 capitalize">
          {invoice.status}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handleDiscard}>
            Discard
          </Button>
          <Button size="sm" onClick={handleSave}>Save Changes</Button>
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
                  <Select value={selectedCustomerId || ""} onValueChange={setSelectedCustomerId} disabled>
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
                    <Input defaultValue={invoice.invoiceNumber} disabled />
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
              <div className="mt-4 flex items-center gap-2">
                <Select value={productIdToAdd} onValueChange={setProductIdToAdd}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
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
                  onChange={(e) => setTax(parseInt(e.target.value) || 0)}
                  className="w-20"
                />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="amount-paid">Amount Paid (₹)</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
              </div>
               <div className="flex items-center justify-between font-semibold text-destructive">
                <span>Amount Due</span>
                <span>₹{amountDue.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" onClick={handleDiscard}>
          Discard
        </Button>
        <Button size="sm" onClick={handleSave}>Save Changes</Button>
      </div>
    </main>
  );
}
