// app/api/invoices/route.ts
import { API_INVOICES, API_INVOICES_DELETE } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { InvoiceApiResponseTypes } from "@/lib/types/invoices";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET /api/invoices
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
    const status = searchParams.get("status") || undefined;

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (q) params.append("q", q);
    if (status) params.append("status", status);

    const response = await fetch(`${API_INVOICES}?${params.toString()}`, {
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

// POST /api/invoices
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
    const response = await fetch(API_INVOICES, {
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

// DELETE /api/invoices
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
    const response = await fetch(API_INVOICES_DELETE, {
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
