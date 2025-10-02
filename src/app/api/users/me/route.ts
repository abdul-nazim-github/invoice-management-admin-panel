import { API_USERS_ME } from "@/constants/apis";
import { nextErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { UserApiResponseTypes } from "@/lib/types/users";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const access_token = cookies().get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(API_USERS_ME, {
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

    const user_info = data?.data.results || null;
    if (!user_info) {
      return NextResponse.json(
        { authenticated: false, error: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: data.success,
      user_info,
    });
  } catch (err: any) {
    return nextErrorResponse(err);
  }
}
