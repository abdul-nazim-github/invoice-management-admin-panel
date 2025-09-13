// app/api/customers/route.ts
import apiClient from "@/lib/helpers/axios/API";
import { NextResponse } from "next/server";

// GET /api/customers
export async function GET() {
  try {
    const response = await apiClient.get("/customers"); // external API
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch customers" },
      { status: error.status || 500 }
    );
  }
}

// POST /api/customers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await apiClient.post("/customers", body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create customer" },
      { status: error.status || 500 }
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