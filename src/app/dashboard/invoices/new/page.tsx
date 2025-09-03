
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  PlusCircle,
  Trash,
  UserPlus,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { customers as initialCustomers, products } from "@/lib/data";
import type { InvoiceItem, Product, Customer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { CustomerForm } from "../../customers/components/customer-form";


export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerIdFromQuery = searchParams.get("customerId");
  const from = searchParams.get("from");

  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const [items, setItems] = React.useState<InvoiceItem[]>([]);
  const [tax, setTax] = React.useState(18);
  const [discount, setDiscount] = React.useState(0);
  const [amountPaid, setAmountPaid] = React.useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(customerIdFromQuery);
  const [productIdToAdd, setProductIdToAdd] = React.useState<string>("");
  const [isCustomerFormOpen, setIsCustomerFormOpen] = React.useState(false);
  const { toast } = useToast();

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
  
  const handleCustomerSave = (newCustomer: Customer | null) => {
    setIsCustomerFormOpen(false);
    if (newCustomer) {
       // In a real app, you would also save this to your database
      const updatedCustomers = [newCustomer, ...customers];
      setCustomers(updatedCustomers);
      setSelectedCustomerId(newCustomer.id);
      toast({
        title: "Customer Saved",
        description: `The new customer has been created and selected.`,
      });
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
        title: "Invoice Saved",
        description: "The new invoice has been successfully saved.",
    });
    if(from) {
      router.push(from);
    } else {
      router.push('/dashboard/invoices');
    }
  }

  const handleDiscard = () => {
     if(from) {
      router.push(from);
    } else {
      router.back();
    }
  };

  const handleGeneratePdf = async () => {
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
    doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 190, 46, { align: "right" });

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
    
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Amount Paid:", 150, y, { align: "right" });
    doc.text(`-₹${amountPaid.toFixed(2)}`, 190, y, { align: "right" });
    
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Amount Due:", 150, y, { align: "right" });
    doc.text(`₹${amountDue.toFixed(2)}`, 190, y, { align: "right" });

    if (amountDue > 0) {
        try {
            // UPI QR Code
            const upiLink = `upi://pay?pa=your-upi-id@okhdfcbank&pn=Invoice%20Pilot%20Inc&am=${amountDue.toFixed(2)}&cu=INR&tn=INV-006`;
            const qrCodeDataUrl = await QRCode.toDataURL(upiLink);
            doc.addImage(qrCodeDataUrl, 'PNG', 20, y + 10, 40, 40);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Scan QR to Pay", 25, y + 55);
        } catch (err) {
            console.error("Failed to generate QR code", err);
        }
    }

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 105, y + 20, { align: "center" });

    doc.save("invoice-006.pdf");
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleDiscard}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
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
                   <div className="flex items-center gap-2">
                    <Select value={selectedCustomerId || ""} onValueChange={setSelectedCustomerId} disabled={!!customerIdFromQuery}>
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
                    <Dialog open={isCustomerFormOpen} onOpenChange={setIsCustomerFormOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <UserPlus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle className="font-headline">Add New Customer</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to add a new customer.
                                </DialogDescription>
                            </DialogHeader>
                            <CustomerForm customer={null} onSave={handleCustomerSave} />
                        </DialogContent>
                    </Dialog>
                   </div>
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
                              parseInt(e.target.value) || 1
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
                   {items.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
             <CardFooter>
                 <Button className="w-full" onClick={handleGeneratePdf} disabled={items.length === 0 || !selectedCustomerId}>Generate PDF</Button>
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
