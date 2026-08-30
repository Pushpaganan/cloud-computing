import { NextResponse } from "next/server";
import { getActiveCount } from "@/lib/presence-store";

export async function GET() {
  const activeUsers = await getActiveCount();
  return NextResponse.json({ activeUsers });
}