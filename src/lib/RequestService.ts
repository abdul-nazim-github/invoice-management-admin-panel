// RequestService.ts
import apiClient from "./apiClient";

function handleError(error: any): never {
  const status = error.response?.status;
  const message =
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again.";

  throw { status, message, raw: error.response?.data };
}

export const getRequest = async <T>(url: string, params?: any): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  } catch (error: any) {
    handleError(error);
  }
};

export const postRequest = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  } catch (error: any) {
    handleError(error);
  }
};

export const putRequest = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  } catch (error: any) {
    handleError(error);
  }
};

export const deleteRequest = async <T>(url: string, data?: any): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(url, data);
    return response.data;
  } catch (error: any) {
    handleError(error);
  }
};
