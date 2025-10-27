import { NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/middleware/authMiddleware"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const session = await verifySession(request)

  if (pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (session.user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/overview", request.url))
    }


    return NextResponse.redirect(new URL("/unauthorized", request.url)) // or `/profile`, `/home`, etc.
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/unauthorized"],
}
