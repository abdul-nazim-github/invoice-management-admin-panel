// types/api.ts
export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
  error: {
    details: string;
  };
}

export interface CustomRequestType { url: string, body: any }