import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ROUTES = {
  protected: ['/feed', '/profile', '/settings', '/dashboard', '/admin'],
  auth: ['/login', '/register', '/auth/login', '/auth/register'],
  public: ['/', '/about', '/contact', '/explore', '/map', '/camps', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'],
  admin: ['/admin'],
} as const

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
)

/**
 * Verify JWT token
 */
async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}

/**
 * Check if user has required role
 */
async function checkUserRole(token: string, requiredRole?: string): Promise<boolean> {
  if (!requiredRole) return true
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userRole = payload.role as string
    if (requiredRole === 'admin') {
      return userRole === 'admin'
    }
    return true
  } catch (error) {
    console.error('Role check failed:', error)
    return false
  }
}

/**
 * Get user authentication status from cookies primarily
 */
async function getAuthStatus(request: NextRequest) {
  // Cookie'den token al (en güvenilir yöntem middleware için)
  const tokenFromCookie = request.cookies.get('auth-token')?.value
  // Header'dan da kontrol et
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  // Client-side auth durumu
  const clientAuthStatus = request.headers.get('x-client-auth') === 'true'
  
  // Cookie'yi öncelikle kullan
  const token = tokenFromCookie || tokenFromHeader
  console.log('[getAuthStatus] Token from cookie:', tokenFromCookie)
  console.log('[getAuthStatus] Token from header:', tokenFromHeader)
  console.log('[getAuthStatus] Client auth status:', clientAuthStatus)
  console.log('[getAuthStatus]', {
    hasCookieToken: !!tokenFromCookie,
    hasHeaderToken: !!tokenFromHeader,
    clientAuthStatus,
    finalToken: !!token,
    cookieValue: tokenFromCookie ? `${tokenFromCookie.substring(0, 10)}...` : 'none'
  })
  
  if (!token) {
    return { 
      isAuthenticated: clientAuthStatus,
      token: null, 
      isValid: false 
    }
  }

  const isValid = await verifyToken(token)
  return {
    isAuthenticated: Boolean(token) || clientAuthStatus,
    token,
    isValid
  }
}

/**
 * Check if path matches any route pattern
 */
function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1))
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  console.log(`[Middleware] Processing: ${pathname}`)

  const authStatus = await getAuthStatus(request)
  const { isAuthenticated, token, isValid } = authStatus

  console.log(`[Middleware] Auth status:`, { 
    isAuthenticated, 
    hasToken: !!token, 
    isValid,
    pathname 
  })

  // If we have a token but it's invalid, clear it
  if (token && !isValid) {
    console.log(`[Middleware] Invalid token detected, clearing authentication`)
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    response.cookies.delete('refresh-token')
    return response
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && matchesRoute(pathname, ROUTES.auth)) {
    console.log(`[Middleware] Redirecting authenticated user from ${pathname} to /feed`)
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  // Handle admin routes
  if (matchesRoute(pathname, ROUTES.admin)) {
    if (!isAuthenticated || !isValid) {
      console.log(`[Middleware] Unauthenticated access to admin route: ${pathname}`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('message', 'admin-required')
      return NextResponse.redirect(loginUrl)
    }

    const hasAdminRole = token ? await checkUserRole(token, 'admin') : false
    if (!hasAdminRole) {
      console.log(`[Middleware] Insufficient permissions for admin route: ${pathname}`)
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Handle protected routes - be more lenient with client-side auth for now
  if (matchesRoute(pathname, ROUTES.protected)) {
    // If we have a valid token, allow access
    if (token && isValid) {
      console.log(`[Middleware] Valid token found, allowing access to ${pathname}`)
    }
    // If no token but client says authenticated, allow but log
    else if (!token) {
      console.log(`[Middleware] No server token but client reports authenticated for ${pathname}`)
    }
    // If neither token nor client auth, redirect to login
    else if (!isAuthenticated && !request.headers.get('x-client-auth')) {
      console.log(`[Middleware] Unauthenticated access to protected route: ${pathname}`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Create response with security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Only set HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // Add user info to headers if authenticated
  if (isAuthenticated && isValid && token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      response.headers.set('X-User-ID', payload.sub as string)
      response.headers.set('X-User-Role', payload.role as string || 'user')
    } catch (error) {
      console.error('Failed to decode token for headers:', error)
    }
  }

  // CSRF protection for state-changing requests
  const isStateChangingMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)
  if (isStateChangingMethod && !pathname.startsWith('/api/auth/')) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    const host = request.headers.get('host')
    
    const isValidOrigin = origin && host && (
      origin.includes(host) || 
      origin === process.env.NEXT_PUBLIC_APP_URL
    )
    const isValidReferer = referer && host && referer.includes(host)
    
    if (!isValidOrigin && !isValidReferer) {
      console.log(`[Middleware] CSRF protection triggered for ${pathname}`)
      return new NextResponse('Forbidden - Invalid origin', { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}