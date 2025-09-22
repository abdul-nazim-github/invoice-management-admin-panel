import { ApiResponse } from "./api";

export interface DashboardStatsTypes {
    total_revenue: number;
    revenue_change_percent: number;
    total_customers: number;
    customers_change_percent: number;
    total_invoices: number;
    pending_invoices: number;
    total_products: number;
}

export type DashboardApiResponseTypes<T = DashboardStatsTypes> = ApiResponse<T>;
