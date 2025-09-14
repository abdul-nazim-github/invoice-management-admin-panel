// app/api/customers/[id]/route.ts
import { API_CUSTOMER } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { CustomerApiResponseTypes } from "@/lib/types/customers";
import { NextResponse } from "next/server";


export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const response = await withAuthProxy<CustomerApiResponseTypes>({
      url: `${API_CUSTOMER}/${id}`,
      method: "PUT",
      data: body,
    });
    return NextResponse.json(response);
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}