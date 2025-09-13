import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LoginApiResponse } from "@/lib/types/auth";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const body = await req.json();
        const response = await apiClient.post<LoginApiResponse>("/auth/sign-in", body);
        const apiResponse = response.data.data.results;
        const res = NextResponse.json({ success: true, user: apiResponse.user_info });
        cookieStore.set("access_token", apiResponse.access_token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
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
