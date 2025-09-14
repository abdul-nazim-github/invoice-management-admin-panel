// types/api.ts
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: {
    meta: Record<string, any>;
    results: T;
  };
  error: {
    details: string;
  };
}

export interface CustomRequestType { url: string, body: any }