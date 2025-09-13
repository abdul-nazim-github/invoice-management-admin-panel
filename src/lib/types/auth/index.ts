// types/auth.ts
import { ApiResponse } from "../api";

export interface LoginResult {
  access_token: string;
  user_info: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    role: string;
  };
}

export interface LoginData {
  meta: Record<string, any>;
  results: LoginResult;
}

export type LoginApiResponse = ApiResponse<LoginData>;
