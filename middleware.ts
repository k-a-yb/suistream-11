import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of paths that require authentication
const PROTECTED_PATHS = ["/collection", "/watch", "/profile", "/subscription"]

// List of paths that are public
const PUBLIC_PATHS = ["/login", "/about", "/help", "/terms", "/privacy"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path))

  // If it's not a protected path, allow access
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Check if the user is authenticated
  const walletConnected = request.cookies.get("wallet_connected")?.value === "true"

  // If not authenticated and trying to access a protected path, redirect to login
  if (!walletConnected) {
    const url = new URL("/login", request.url)
    url.searchParams.set("returnUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Allow access to the protected path
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
