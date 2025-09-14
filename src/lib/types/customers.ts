import { ApiResponse } from "./api";

export interface CustomerDataTypes {
    id: string;
    full_name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    gst_number?: string | null;
    created_at: string; 
    updated_at?: string | null;
    deleted_at?: string | null;
}

export type CustomerApiResponseTypes = ApiResponse<CustomerDataTypes>;
