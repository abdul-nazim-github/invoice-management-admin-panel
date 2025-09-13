import apiClient from "@/lib/helpers/axios/API";
import { withAuthProxy } from "@/lib/helpers/axios/withAuthProxy";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const resp = await withAuthProxy({url: "/users/me", method: "GET"});
  const user = resp.data.data?.results?.user || null;
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user,
  });
}
