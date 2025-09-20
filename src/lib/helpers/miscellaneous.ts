
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { CustomerDataTypes } from "../types/customers";

// Currency formatter with ₹ + Indian commas
export const formatCurrency = (amount: number) => {
  return `₹${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

export const generateInvoicePDF = async ({
  invoiceNumber,
  customer,
  items,
  subtotal,
  tax,
  taxAmount,
  discount,
  total,
  amountPaid,
  amountDue,
  fontBase64,
  fontName = "CustomFont",
}: {
  invoiceNumber: string;
  customer: CustomerDataTypes;
  items: { name: string; ordered_quantity: number; unit_price: number; stock_quantity: number }[];
  subtotal: number;
  tax: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  fontBase64?: string;
  fontName?: string;
}) => {
  const doc = new jsPDF();

  // Add custom font if provided
  if (fontBase64) {
    doc.addFileToVFS(`${fontName}.ttf`, fontBase64);
    doc.addFont(`${fontName}.ttf`, fontName, "normal");
    doc.setFont(fontName);
  }

  // Header
  doc.setFontSize(22);
  doc.setFont(fontName, "bold");
  doc.text("Invoice", 105, 20, { align: "center" });

  // Company & Customer Details
  let y_pos = 40;
  doc.setFontSize(12);
  doc.setFont(fontName, "bold");
  doc.text("Invoice Pilot Inc.", 20, y_pos);
  y_pos += 6;
  doc.setFont(fontName, "normal");
  doc.text("123 App Street, Dev City", 20, y_pos);
  y_pos += 6;
  doc.text("GST: 12ABCDE1234F1Z5", 20, y_pos);
  y_pos += 6;
  doc.text("Phone: +91 123 456 7890", 20, y_pos);
  y_pos += 6;
  doc.text("Email: billing@pilot.com", 20, y_pos);
  y_pos += 14;

  doc.text(`Bill To: ${customer.full_name}`, 20, y_pos);
  y_pos += 6;
  doc.text(customer.address ?? "", 20, y_pos);
  y_pos += 6;
  doc.text(customer.email ?? "", 20, y_pos);

  doc.text(`Invoice Number: ${invoiceNumber}`, 190, 40, { align: "right" });
  doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 190, 46, { align: "right" });

  // Table Header
  let y = 100;
  doc.setFont(fontName, "bold");
  doc.text("Product", 20, y);
  doc.text("Qty", 120, y);
  doc.text("Price", 150, y, { align: "right" });
  doc.text("Total", 190, y, { align: "right" });
  doc.line(20, y + 2, 190, y + 2);

  // Table Body
  y += 8;
  doc.setFont(fontName, "normal");
  items.forEach(item => {
    doc.text(item.name, 20, y);
    doc.text(item.ordered_quantity.toString(), 120, y);
    doc.text(item.unit_price.toFixed(2), 150, y, { align: "right" });
    doc.text((item.unit_price * item.ordered_quantity).toFixed(2), 190, y, { align: "right" });
    y += 7;
  });

  // Totals
  y += 5;
  doc.line(120, y, 190, y);
  y += 7;
  doc.setFont(fontName, "bold");
  doc.text("Subtotal:", 150, y, { align: "right" });
  doc.setFont(fontName, "normal");
  doc.text(subtotal.toFixed(2), 190, y, { align: "right" });
  y += 7;

  doc.setFont(fontName, "bold");
  doc.text(`Tax (${tax}%):`, 150, y, { align: "right" });
  doc.setFont(fontName, "normal");
  doc.text(taxAmount.toFixed(2), 190, y, { align: "right" });
  y += 7;

  if (discount > 0) {
    doc.setFont(fontName, "bold");
    doc.text("Discount:", 150, y, { align: "right" });
    doc.setFont(fontName, "normal");
    doc.text(`-${discount.toFixed(2)}`, 190, y, { align: "right" });
    y += 7;
  }

  doc.setFont(fontName, "bold");
  doc.text("Total:", 150, y, { align: "right" });
  doc.text(total.toFixed(2), 190, y, { align: "right" });
  y += 7;

  doc.setFont(fontName, "bold");
  doc.text("Amount Paid:", 150, y, { align: "right" });
  doc.text(`-${amountPaid.toFixed(2)}`, 190, y, { align: "right" });
  y += 7;

  doc.setFont(fontName, "bold");
  doc.text("Amount Due:", 150, y, { align: "right" });
  doc.text(amountDue.toFixed(2), 190, y, { align: "right" });

  // UPI QR Code
  if (amountDue > 0) {
    try {
      const upiLink = `upi://pay?pa=invoice-pilot@okhdfcbank&pn=Invoice%20Pilot%20Inc&am=${amountDue.toFixed(
        2
      )}&cu=INR&tn=${invoiceNumber}`;
      const qrCodeDataUrl = await QRCode.toDataURL(upiLink);
      doc.addImage(qrCodeDataUrl, "PNG", 20, y + 10, 40, 40);
      doc.setFontSize(10);
      doc.setFont(fontName, "normal");
      doc.text("Scan QR to Pay", 25, y + 55);
    } catch (err) {
      console.error("Failed to generate QR code", err);
    }
  }

  // Footer
  doc.setFontSize(10);
  doc.text("Thank you for your business!", 105, y + 20, { align: "center" });

  doc.save(`invoice-${invoiceNumber}.pdf`);
};
