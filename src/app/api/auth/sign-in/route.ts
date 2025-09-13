import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginApiResponse } from "@/lib/types/auth";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies()
        const body = await req.json();
        const response = await apiClient.post<LoginApiResponse>("/auth/sign-in", body);
        const apiResponse = response.data;
        const res = NextResponse.json({ success: apiResponse.success, user: apiResponse.data.results.user_info });
        cookieStore.set({
            name: 'access_token',
            value: apiResponse.data.results.access_token,
            secure: true,
            sameSite: 'none',
            path: '/',
            // domain: '.codeclouds.com',
            maxAge: 60 * 60 * 24 * 7
        });
        return res;
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || "Sign-in failed";
        const details = error.raw || null;
        return NextResponse.json(
            { success: false, error: message, details },
            { status }
        );
    }
}
