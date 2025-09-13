import apiClient from "@/lib/apiClient";
import { getAuthHeaders } from "@/lib/helpers/auth";
import { deleteAccessToken } from "@/lib/helpers/cookie";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const headers = await getAuthHeaders();
    const response = await apiClient.post("/auth/sign-out", {}, { headers });

    if (response?.data?.success) {
      deleteAccessToken()
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Sign-out failed" }, { status: 400 });
  } catch (error: any) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: error.message || "Logout failed" },
      { status: error.status || 500 }
    );
  }
}
