
import { $Infer } from "@/lib/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
type Session = typeof $Infer.Session

export async function verifySession(request: NextRequest) {

  try {
    const { data: session } = await betterFetch<Session>(
		"/api/v1/auth/get-session",
		{
			baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
			headers: {
				cookie: request.headers.get("cookie") || "",
        'x-client-type': 'desktop'
			},
		},
	);

    return session
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }