// app/api/customers/route.ts
import { API_CUSTOMER } from "@/constants/apis";
import apiClient from "@/lib/helpers/axios/API";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { CustomerApiResponseTypes } from "@/lib/types/customers";
import { NextResponse } from "next/server";

// GET /api/customers
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const q = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;

    const response = await withAuthProxy<CustomerApiResponseTypes>({
      url: API_CUSTOMER,
      method: "GET",
      params: {
        page,
        limit,
        ...(q ? { q } : {}),
        ...(status ? { status } : {}),
      },
    });
    return NextResponse.json(response);
  } catch (err: any) {
    const status = err?.response?.status || 500;
    if (status >= 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Server Error",
          error: { details: "Something went wrong, please try again later." },
          type: "server_error",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: err?.response?.data?.message || "Request failed",
        error: err?.response?.data?.error || { details: "Unknown error" },
        type: err?.response?.data?.type || "unknown_error",
      },
      { status }
    );
  }
}

// POST /api/customers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await withAuthProxy<CustomerApiResponseTypes>({
      url: API_CUSTOMER,
      method: "POST",
      data: body
    });
    return NextResponse.json(response);
  } catch (err: any) {
    const status = err?.response?.status || 500;
    if (status >= 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Server Error",
          error: { details: "Something went wrong, please try again later." },
          type: "server_error",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: err?.response?.data?.message || "Request failed",
        error: err?.response?.data?.error || { details: "Unknown error" },
        type: err?.response?.data?.type || "unknown_error",
      },
      { status }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const response = await apiClient.post('/customers/bulk-delete', body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete customer" },
      { status: error.status || 500 }
    );
  }
}