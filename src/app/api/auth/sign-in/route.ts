import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";
    import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
        const cookieStore = await cookies();
    const body = await req.json();
    const response = await apiClient.post("/auth/sign-in", body);    
    const result = response.data?.data.results;
    if (!result.access_token) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, user: result.user_info });
        cookieStore.set('access_token', result.access_token, {
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