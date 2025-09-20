import { ApiResponse } from "./api";
import { CustomerDataTypes } from "./customers";
import { ProductDataTypes } from "./products";

export interface InvoiceDataTypes {
  id: string;
  invoice_number: string;
  customer_full_name: string;
  status: "Pending" | "Paid" | "Overdue";
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  created_at: string;
  updated_at: string | null;
}

export interface InvoiceAggregates {
  total_billed: number;
  total_paid: number;
  total_due: number;
  invoices: InvoiceDataTypes[];
}
export interface InvoiceItem extends ProductDataTypes {
  ordered_quantity: number;
}
export interface InvoiceDetailsType extends InvoiceDataTypes {
  customer: CustomerDataTypes;
}

export interface DeletedResponse {
    deleted_count: number
} 
export type InvoiceApiResponseTypes<T = InvoiceDataTypes | InvoiceDataTypes[] | DeletedResponse> = ApiResponse<T>;
export type InvoiceDetailsApiResponseType = ApiResponse<InvoiceDetailsType>;
