import { ApiResponse } from "./api";

export interface UserDataTypes {
    billing_address?: string;
    billing_city?: string;
    billing_gst?: string;
    billing_pin?: string;
    billing_state?: string;
    email: string;
    full_name: string;
    id: string;
    role: "user" | "admin";
    username: string;
}

export interface UserResultsReponseType {
    user_info: UserDataTypes;
}

export interface UserResponseTypes {
    meta: Record<string, any>;
    results: UserResultsReponseType;
}

export type UserApiResponseTypes = ApiResponse<UserResponseTypes>;
