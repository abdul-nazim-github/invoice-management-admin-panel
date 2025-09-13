import apiClient from "@/lib/apiClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const resp = await apiClient.get("/users/me");
  const user = resp.data.data?.results?.user || null;
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user,
  });
}
