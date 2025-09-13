import API from "@/lib/helpers/axios/API";
import { SignInApiResponseTypes } from "@/lib/types/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await API.post<SignInApiResponseTypes>("/auth/sign-in", body);
        const apiResponse = response.data;
        const res = NextResponse.json({
            success: apiResponse.success,
            user_info: apiResponse.data.results.user_info,
        });
        res.cookies.set({
            name: "access_token",
            value: apiResponse.data.results.access_token,
            httpOnly: true,   // more secure
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err?.response?.data || "Login failed" },
            { status: err?.response?.status || 500 }
        );
    }
}
