import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/middleware/authMiddleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await verifySession(request);

  if (pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.redirect(new URL("/auth/delete", request.url));
  }

  if (pathname.startsWith("/auth/delete")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/delete", "/dashboard/:path*", "/settings/:path*"],
};
