export interface InvoiceDataTypes {
  id: string;
  invoice_number: string;
  customer_full_name: string;
  total_amount: string;
  paid_amount: number;
  due_amount: number;
  status: "pending" | "paid" | "cancelled" | "overdue";
  created_at: string;
}
