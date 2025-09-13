import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginApiResponse } from "@/lib/types/auth";
import { setAccessToken } from "@/lib/helpers/cookie";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const body = await req.json();
        const response = await apiClient.post<LoginApiResponse>("/auth/sign-in", body);
        const apiResponse = response.data;
        const res = NextResponse.json({ success: apiResponse.success, user: apiResponse.data.results.user_info });
        setAccessToken(apiResponse.data.results.access_token)
        return res;
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.response.data.message || "Sign-in failed";
        const details = error.response.data.error.details || null;
        return NextResponse.json(
            { success: error.response.data.success, error: message, details },
            { status }
        );
    }
}
