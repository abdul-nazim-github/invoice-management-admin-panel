import { ApiResponse } from "./api";

export interface CustomerDataTypes {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    gst_number?: string | null;
    created_at: string; 
    updated_at?: string | null;
    deleted_at?: string | null;
    status?: string | null
}


export type CustomerApiResponseTypes<T = CustomerDataTypes | CustomerDataTypes[]> = ApiResponse<T>;