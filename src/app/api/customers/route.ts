// app/api/customers/route.ts
import { API_CUSTOMER, API_CUSTOMER_DELETE } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { CustomerApiResponseTypes } from "@/lib/types/customers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET /api/customers
export async function GET(req: Request) {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const q = searchParams.get("q") || undefined;
    const status = search_params.get("status") || undefined;

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (q) params.append("q", q);
    if (status) params.append("status", status);

    const response = await fetch(`${API_CUSTOMER}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return nextErrorResponse(data);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

// POST /api/customers
export async function POST(req: Request) {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const response = await fetch(API_CUSTOMER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return nextErrorResponse(data);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}

// DELETE /api/customers
export async function DELETE(req: Request) {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const response = await fetch(API_CUSTOMER_DELETE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return nextErrorResponse(data);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}
