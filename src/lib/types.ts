export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  createdAt: Date;
  status?: "Paid" | "Pending" | "Overdue" | "New";
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

export type InvoiceItem = {
  product: Product;
  quantity: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  items: InvoiceItem[];
  date: Date;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  status: "Paid" | "Pending" | "Overdue";
};
