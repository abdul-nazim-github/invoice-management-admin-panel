import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await apiClient.post("/auth/login", body);    
    const access_token = response.data?.data.results.access_token;
    if (!access_token) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ set HttpOnly cookie (secure, not visible to JS)
    const res = NextResponse.json({ success: true, user: response.data?.data.results.user_info });
    res.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1h
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
