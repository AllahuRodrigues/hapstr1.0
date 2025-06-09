import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the auth cookie
  const authCookie = request.cookies.get('hapstr_session')
  const isAuthenticated = !!authCookie?.value
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Redirect to sign in if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 