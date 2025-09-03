
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft, Download, Pencil, IndianRupee } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import Image from "next/image";


const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="mr-2 h-4 w-4"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2.05 22L7.31 20.62C8.75 21.41 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2ZM12.04 20.13C10.56 20.13 9.13 19.74 7.89 19L7.5 18.78L4.85 19.5L5.64 16.93L5.41 16.55C4.68 15.22 4.26 13.62 4.26 11.91C4.26 7.6 7.76 4.1 12.04 4.1C16.32 4.1 19.82 7.6 19.82 11.91C19.82 16.22 16.32 20.13 12.04 20.13ZM16.56 14.45C16.31 14.18 15.82 13.91 15.42 13.73L13.52 12.83C13.29 12.72 13.12 12.66 12.97 12.89C12.82 13.12 12.22 13.79 12.04 13.97C11.86 14.15 11.68 14.18 11.43 14.06C10.93 13.84 10.01 13.49 9.02 12.59C8.21 11.88 7.64 11.03 7.47 10.76C7.3 10.49 7.42 10.33 7.55 10.2C7.66 10.09 7.81 9.92 7.96 9.77C8.11 9.62 8.17 9.49 8.29 9.26C8.41 9.03 8.35 8.86 8.26 8.71L7.78 7.5C7.67 7.23 7.55 7.25 7.44 7.25H7.04C6.84 7.25 6.56 7.31 6.34 7.53C6.12 7.76 5.59 8.24 5.59 9.24C5.59 10.24 6.37 11.2 6.52 11.38C6.67 11.56 7.81 13.44 9.73 14.35C11.65 15.25 11.68 14.86 12.28 14.8C12.88 14.74 14.18 14.06 14.43 13.4C14.68 12.74 14.68 12.18 14.62 12.06C14.56 11.94 14.38 11.88 14.13 11.76L13.88 11.7C13.62 11.82 13.4 11.91 13.24 12.09C13.08 12.27 12.83 12.57 12.83 12.94C12.83 13.31 13.23 13.65 13.35 13.76C13.47 13.88 15.35 14.89 16.05 15.17C16.75 15.46 16.75 15.34 16.81 15.01C16.87 14.68 16.81 14.71 16.56 14.45Z" />
  </svg>
);


export default function ViewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const invoice = invoices.find((inv) => inv.id === params.id);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);

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
  
  const { 
    invoiceNumber, 
    customer, 
    items, 
    date, 
    subtotal, 
    tax, 
    discount, 
    total, 
    status,
    amountPaid
} = invoice;

 const taxPercentage = subtotal > 0 ? (tax / subtotal * 100).toFixed(0) : "0";
 const amountDue = total - amountPaid;

  React.useEffect(() => {
    if (amountDue > 0) {
      const upiLink = `upi://pay?pa=invoice-pilot@okhdfcbank&pn=Invoice%20Pilot%20Inc&am=${amountDue.toFixed(2)}&cu=INR&tn=${invoiceNumber}`;
      QRCode.toDataURL(upiLink)
        .then(url => {
          setQrCodeDataUrl(url);
        })
        .catch(err => {
          console.error("Failed to generate QR code", err);
        });
    } else {
      setQrCodeDataUrl(null);
    }
  }, [amountDue, invoiceNumber]);


 const handleSendWhatsApp = () => {
    if (!customer?.phone) {
      toast({
        title: "Customer phone number not available",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = customer.phone.replace(/[^0-9]/g, "");
    const message = `Hello ${customer.name},\n\nHere is your invoice ${invoiceNumber} for ₹${total.toFixed(2)}.\nAmount Due: ₹${amountDue.toFixed(2)}\n\nThank you for your business!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

 const handleGeneratePdf = async () => {
    if (!customer) return;
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 105, 20, { align: "center" });

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

    
    doc.text(`Bill To: ${customer.name}`, 20, y_pos);
    y_pos += 6;
    doc.text(customer.address, 20, y_pos);
    y_pos += 6;
    doc.text(customer.email, 20, y_pos);

    doc.text(`Invoice Number: ${invoiceNumber}`, 190, 40, { align: "right" });
    doc.text(`Date: ${new Date(date).toLocaleDateString("en-GB")}`, 190, 46, { align: "right" });

    let y = 100;
    doc.setFont("helvetica", "bold");
    doc.text("Product", 20, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 150, y, { align: "right" });
    doc.text("Total", 190, y, { align: "right" });
    doc.line(20, y + 2, 190, y + 2);
    
    y += 8;
    doc.setFont("helvetica", "normal");
    items.forEach(item => {
        doc.text(item.product.name, 20, y);
        doc.text(item.quantity.toString(), 120, y);
        doc.text(`₹${item.product.price.toFixed(2)}`, 150, y, { align: "right" });
        doc.text(`₹${(item.product.price * item.quantity).toFixed(2)}`, 190, y, { align: "right" });
        y += 7;
    });

    y += 5;
    doc.line(120, y, 190, y);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 150, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`₹${subtotal.toFixed(2)}`, 190, y, { align: "right" });
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text(`Tax (${taxPercentage}%):`, 150, y, { align: "right" });
     doc.setFont("helvetica", "normal");
    doc.text(`₹${tax.toFixed(2)}`, 190, y, { align: "right" });
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
            const upiLink = `upi://pay?pa=invoice-pilot@okhdfcbank&pn=Invoice%20Pilot%20Inc&am=${amountDue.toFixed(2)}&cu=INR&tn=${invoiceNumber}`;
            const qrCodeDataUrl = await QRCode.toDataURL(upiLink);
            doc.addImage(qrCodeDataUrl, 'PNG', 20, y + 10, 40, 40);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Scan QR to Pay", 25, y + 55);
        } catch (err) {
            console.error("Failed to generate QR code", err);
        }
    }


    doc.setFontSize(10);
    doc.text("Thank you for your business!", 105, y + 20, { align: "center" });

    doc.save(`invoice-${invoiceNumber}.pdf`);
  };

  const handleEdit = () => {
    const from = searchParams.get('from');
    let editUrl = `/dashboard/invoices/${invoice.id}/edit`;
    if (from) {
      editUrl += `?from=${encodeURIComponent(from)}`;
    }
    router.push(editUrl);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold font-headline tracking-tight sm:grow-0">
          Invoice {invoiceNumber}
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0 capitalize">
          {status}
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm" onClick={handleSendWhatsApp}>
            <WhatsAppIcon />
            Send
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
             <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button size="sm" onClick={handleGeneratePdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-3xl">{invoiceNumber}</CardTitle>
            <CardDescription>
              Issued on {new Date(date).toLocaleDateString("en-GB")}
            </CardDescription>
          </div>
          <div className="text-right">
             <div className="font-semibold">Invoice Pilot Inc.</div>
             <div className="text-sm text-muted-foreground">
                123 App Street, Dev City<br/>
                GST: 12ABCDE1234F1Z5<br/>
                Phone: +91 123 456 7890<br/>
                Email: billing@pilot.com
             </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="text-sm text-muted-foreground">Bill To:</div>
                    <div className="font-semibold">{customer.name}</div>
                    <div>{customer.address}</div>
                    <div>{customer.email}</div>
                    <div>{customer.phone}</div>
                </div>
                 {qrCodeDataUrl && (
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="text-sm text-muted-foreground">Scan to Pay</div>
                        <Image src={qrCodeDataUrl} alt="UPI QR Code" width={120} height={120} />
                    </div>
                )}
            </div>

          <div className="mt-6">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-2/5">Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {items.map((item) => (
                    <TableRow key={item.product.id}>
                    <TableCell className="font-medium">
                        {item.product.name}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                        ₹{item.product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax ({taxPercentage}%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                </div>
                 {discount > 0 && (
                    <div className="flex justify-between">
                        <span>Discount</span>
                        <span>-₹{discount.toFixed(2)}</span>
                    </div>
                 )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span>Amount Paid</span>
                    <span>-₹{amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-destructive text-md border-t pt-2">
                    <span>Amount Due</span>
                    <span>₹{amountDue.toFixed(2)}</span>
                </div>
            </div>
        </CardFooter>
      </Card>
      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm" onClick={handleEdit}>
             <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
           <Button variant="outline" size="sm" onClick={handleSendWhatsApp}>
            <WhatsAppIcon />
            Send
          </Button>
          <Button size="sm" onClick={handleGeneratePdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
      </div>
    </main>
  );
}
