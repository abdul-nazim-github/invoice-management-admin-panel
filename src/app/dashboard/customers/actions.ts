"use server";

import { getCustomerInsightsSummary } from "@/ai/flows/customer-insights-summary";

export async function fetchCustomerInsights(customerName: string) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = await getCustomerInsightsSummary({ customerName });
    return result.summary;
  } catch (error) {
    console.error("Error fetching customer insights:", error);
    return "An error occurred while fetching insights. Please try again.";
  }
}
