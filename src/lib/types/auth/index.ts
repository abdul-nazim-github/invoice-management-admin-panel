// types/auth.ts
import { ApiResponse } from "../api";

export interface SignInDataTypes {
  access_token: string;
  user_info: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    role: string;
  };
}

export interface SignInResponseTypes {
  meta: Record<string, any>;
  results: SignInDataTypes;
}

export type SignInApiResponseTypes = ApiResponse<SignInResponseTypes>;
