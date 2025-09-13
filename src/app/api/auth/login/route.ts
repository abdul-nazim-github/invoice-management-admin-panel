import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";
    import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
        const cookieStore = await cookies();
    const body = await req.json();
    const response = await apiClient.post("/auth/login", body);    
    const access_token = response.data?.data.results.access_token;
    if (!access_token) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, user: response.data?.data.results.user_info });
        cookieStore.set('access_token', access_token, {
        httpOnly: true, // Recommended for security
        secure: true,   // Recommended for HTTPS
        maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
        path: '/',
    });


    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
