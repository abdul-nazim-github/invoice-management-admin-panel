// app/api/invoices/[id]/route.ts
import { API_INVOICES } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { InvoiceApiResponseTypes, InvoiceDetailsApiResponseType } from "@/lib/types/invoices";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const response = await fetch(`${API_INVOICES}/${id}`, {
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

export async function PUT(req: Request, context: { params: { id: string } }) {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const response = await fetch(`${API_INVOICES}/${id}`, {
      method: "PUT",
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
