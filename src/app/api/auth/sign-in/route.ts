import { API_AUTH_SIGN_IN } from "@/constants/apis";
import { encryptToken } from "@/lib/crypto";
import API from "@/lib/helpers/axios/API";
import { axiosErrorResponse } from "@/lib/helpers/axios/errorHandler";
import { SignInApiResponseTypes } from "@/lib/types/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const response = await API.post<SignInApiResponseTypes>(API_AUTH_SIGN_IN, body);
        const apiResponse = response.data;
        const res = NextResponse.json({
            user_info: apiResponse.data.results.user_info,
            message: apiResponse.message,
            success: true
        });
        const encrypted_access_token = await encryptToken({ access_token: apiResponse.data.results.access_token, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) }); // 2 hours
        res.cookies.set({
            name: "access_token",
            value: encrypted_access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return res;
    } catch (err: any) {
        return axiosErrorResponse(err)
    }
}
