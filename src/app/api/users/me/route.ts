import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract access_token from cookies
    const cookie = req.headers.get("cookie");
    let access_token: string | null = null;

    if (cookie) {
      const match = cookie.match(/access_token=([^;]+)/);
      if (match) access_token = match[1];
    }

    if (!access_token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Call backend with Authorization header
    const resp = await apiClient.get("/users/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    // Validate backend response
    const user = resp.data.data?.results?.user || null;
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: any) {
    console.error("API /auth/me error:", error);

    // Handle backend 401/403 errors separately
    if (error.response?.status === 401 || error.response?.status === 403) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Fallback for other errors
    return NextResponse.json(
      { authenticated: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
