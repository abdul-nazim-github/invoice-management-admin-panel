export interface InvoiceDataTypes {
  id: string;
  invoice_number: string;
  customer_full_name: string;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: "Pending" | "Paid" | "Overdue";
  created_at: string;
}
