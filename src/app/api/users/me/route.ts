import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await withAuthProxy({
      url: "/users/me",
      method: "GET",
    });
    const user = response?.data?.results?.user || null;    
    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: any) {
    console.error("GET /users/me error:", error);

    return NextResponse.json(
      {
        authenticated: false,
        error:
          error?.response?.data?.error ||
          error?.data?.error ||
          error?.message ||
          "Failed to fetch user info",
      },
      { status: error?.response?.status || error?.status || 500 }
    );
  }
}
