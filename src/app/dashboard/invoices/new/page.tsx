
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { capitalizeWords } from "@/lib/helpers/forms";
import { MetaTypes } from "@/lib/types/api";
import { CustomerDataTypes } from "@/lib/types/customers";
import { ProductDataTypes, ProductsApiResponseTypes } from "@/lib/types/products";
import jsPDF from "jspdf";
import {
  ChevronLeft,
  PlusCircle,
  Trash
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import * as React from "react";
import { useEffect, useState } from "react";
import CustomersInvoice from "./customers";
import ProductsInvoice from "./products";
import { InvoiceItem } from "@/lib/types/invoices";


export default function NewInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const customerIdFromQuery = searchParams.get("customerId");
  const from = searchParams.get("from");

  const [customers, setCustomers] = useState<CustomerDataTypes[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(customerIdFromQuery);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [tax, setTax] = React.useState(18);
  const [discount, setDiscount] = React.useState(0);
  const [amountPaid, setAmountPaid] = React.useState(0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.unit_price * item.ordered_quantity,
    0
  );
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount - discount;
const amountDue = Math.max(0, Math.round((total - amountPaid) * 100) / 100);

  const handleSaveInvoice = async () => {
    // ✅ Check customer
    if (!selectedCustomerId) {
      toast({
        title: "Missing Customer",
        description: "Please select a customer before saving the invoice.",
        variant: "destructive",
      });
      return;
    }
    console.log('items: ', items);

    // ✅ Check products
    if (items.length === 0) {
      toast({
        title: "No Products",
        description: "Please add at least one product to the invoice.",
        variant: "destructive",
      });
      return;
    }

    // ✅ Check each product quantity
    for (const item of items) {
      if (item.ordered_quantity <= 0) {
        toast({
          title: "Invalid Quantity",
          description: `Quantity for "${item.name}" cannot be empty or zero.`,
          variant: "destructive",
        });
        return;
      }
      if (item.ordered_quantity > item.stock_quantity) {
        toast({
          title: "Out of Stock",
          description: `Quantity for "${item.name}" exceeds available stock (${item.stock_quantity}).`,
          variant: "destructive",
        });
        return;
      }
    }

    // ✅ If everything is valid → save invoice
    try {
      // Example API call
      await saveInvoice({
        customerId: selectedCustomerId,
        items,
      });

      toast({
        title: "Success",
        description: "Invoice saved successfully.",
        variant: "default",
      });

      // Reset if needed
      setItems([]);
    } catch (err: any) {
      const parsed = handleApiError(err);
      toast({
        title: parsed.title,
        description: parsed.description,
        variant: "destructive",
      });
    }
  };

  const handleDiscard = () => {
    if (from) {
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
    y_pos += 6;
    doc.text("Phone: +91 123 456 7890", 20, y_pos);
    y_pos += 6;
    doc.text("Email: billing@pilot.com", 20, y_pos);
    y_pos += 14;


    doc.text(`Bill To: ${selectedCustomer.full_name}`, 20, y_pos);
    y_pos += 6;
    doc.text(selectedCustomer.address, 20, y_pos);
    y_pos += 6;
    doc.text(selectedCustomer.email, 20, y_pos);

    doc.text(`Invoice Number: INV-006`, 190, 40, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 190, 46, { align: "right" });

    // Table Header
    let y = 100;
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
      doc.text(item.name, 20, y);
      doc.text(item.stock_quantity.toString(), 120, y);
      doc.text(`₹${item.unit_price.toFixed(2)}`, 150, y, { align: "right" });
      doc.text(`₹${(item.unit_price * item.stock_quantity).toFixed(2)}`, 190, y, { align: "right" });
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
        const upiLink = `upi://pay?pa=invoice-pilot@okhdfcbank&pn=Invoice%20Pilot%20Inc&am=${amountDue.toFixed(2)}&cu=INR&tn=INV-006`;
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
          <Button size="sm" onClick={handleSaveInvoice}>Save Invoice</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <CustomersInvoice customers={customers} setCustomers={setCustomers} selectedCustomerId={selectedCustomerId} setSelectedCustomerId={setSelectedCustomerId} />
          <ProductsInvoice items={items} setItems={setItems} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between text-sm">
                <span>Tax ({tax}%)</span>
                <span>₹{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <hr className="my-1 border-gray-200" />

              {/* Total */}
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Amount Paid */}
              <div className="flex items-center justify-between">
                <Label htmlFor="amount-paid">Amount Paid (₹)</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  min={0}
                  max={total} // HTML input max
                  value={isNaN(amountPaid) ? "" : amountPaid} // show empty if NaN
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setAmountPaid(NaN);
                      return;
                    }
                    let parsed = parseFloat(val);
                    if (!isNaN(parsed)) {
                      // clamp to total and round to 2 decimals
                      if (parsed > total) parsed = total;
                      parsed = Math.round(parsed * 100) / 100;
                      setAmountPaid(parsed);
                    }
                  }}
                  onBlur={(e) => {
                    let parsed = parseFloat(e.target.value);
                    if (isNaN(parsed) || parsed < 0) parsed = 0;
                    if (parsed > total) parsed = total;
                    parsed = Math.round(parsed * 100) / 100;
                    setAmountPaid(parsed);
                  }}

                  className="w-24"
                />
              </div>


              {/* Amount Due */}
              <div className="flex justify-between text-base font-semibold text-destructive">
                <span>Amount Due</span>
                <span>₹{amountDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              {/* Tax Input */}
              <div className="flex items-center justify-between mt-2">
                <Label htmlFor="tax" className="flex items-center gap-2">Tax (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  min={0}
                  value={isNaN(tax) ? "" : tax}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setTax(NaN);
                      return;
                    }
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed)) setTax(parsed);
                  }}
                  onBlur={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    setTax(isNaN(parsed) || parsed < 0 ? 0 : parsed);
                  }}
                  className="w-20"
                />
              </div>

              {/* Discount Input */}
              <div className="flex items-center justify-between">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  value={isNaN(discount) ? "" : discount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setDiscount(NaN);
                      return;
                    }
                    const parsed = parseFloat(val);
                    if (!isNaN(parsed)) setDiscount(parsed);
                  }}
                  onBlur={(e) => {
                    const parsed = parseFloat(e.target.value);
                    setDiscount(isNaN(parsed) || parsed < 0 ? 0 : parsed);
                  }}
                  className="w-24"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleGeneratePdf} disabled={items.length === 0 || !selectedCustomerId}>
                Generate PDF
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm" onClick={handleDiscard}>
          Discard
        </Button>
        <Button size="sm" onClick={handleSaveInvoice}>Save Invoice</Button>
      </div>
    </main>
  );
}

