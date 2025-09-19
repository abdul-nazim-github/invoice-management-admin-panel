export type CustomerFormType = {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  gst_number?: string;
  created_at?: Date;
};
export type ProductFormType = {
 id: string;
  name: string;
  description: string;
  sku: string;
  stock_quantity: number;
  unit_price: number;
};

export type InvoiceItemFormType = {
  product: ProductFormType;
  quantity: number;
};

export type InvoiceFormType = {
  id: string;
  invoiceNumber: string;
  customer: CustomerFormType;
  items: InvoiceItemFormType[];
  date: Date;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  status: "Paid" | "Pending" | "Overdue";
};
