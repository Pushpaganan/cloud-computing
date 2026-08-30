import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { heartbeat } from "@/lib/presence-store";

const PRESENCE_COOKIE = "presence_id";

export async function POST() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(PRESENCE_COOKIE)?.value;
  const isNewSession = !sessionId;

  if (!sessionId) {
    sessionId = randomUUID();
  }

  await heartbeat(sessionId);

  const response = NextResponse.json({ ok: true });

  if (isNewSession) {
    response.cookies.set({
      name: PRESENCE_COOKIE,
      value: sessionId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}