import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { deleteAccessToken, getAcessToken } from "@/lib/helpers/cookie";

export async function POST() {
  try {
    const token = await getAcessToken();
    console.log('token: ', token);
    
    const response = await apiClient.post(
      "/auth/sign-out",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

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
