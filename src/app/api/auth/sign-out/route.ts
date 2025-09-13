import { NextResponse } from "next/server";
import apiClient from "@/lib/apiClient";
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const response = await apiClient.post("/auth/logout");
    console.log('response: ', response);
    
    if (response?.data?.success) {
      const res = NextResponse.json({ success: true });
      cookieStore.delete("access_token")
      return res;
    }

    return NextResponse.json({ error: "Logout failed" }, { status: 400 });
  } catch (error: any) {
        console.log('error: ', error);

    return NextResponse.json(
      { error: error.message || "Logout failed" },
      { status: error.status || 500 }
    );
  }
}
