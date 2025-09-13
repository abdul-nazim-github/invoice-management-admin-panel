import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";
    import { cookies } from 'next/headers';
import { LoginApiResponse } from "@/lib/types/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const body = await req.json();
    const response = await apiClient.post<LoginApiResponse>("/auth/sign-in", body);    
    if (!response?.data.success) {
        return NextResponse.json({ error: response?.data.message }, { status: response.status });
    }
    const apiResponse = response.data.data.results;
    const res = NextResponse.json({ success: true, user: apiResponse.user_info });
        cookieStore.set('access_token', apiResponse.access_token, {
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