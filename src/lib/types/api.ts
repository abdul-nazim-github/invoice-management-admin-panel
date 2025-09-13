// types/api.ts
export interface ApiResponseBase {
  message: string;
  success: boolean;
}

export interface ApiErrorResponse extends ApiResponseBase {
  success: false;
  error: {
    details: string;
  };
}

export interface ApiSuccessResponse<T> extends ApiResponseBase {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
