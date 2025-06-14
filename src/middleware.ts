import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ROUTES = {
  protected: ['/feed', '/profile', '/settings', '/dashboard', '/admin'],
  auth: ['/login', '/register', '/auth/login', '/auth/register'],
   public: [
    '/',
    '/about',
    '/contact',
    '/explore',
    '/map',
    '/camps',
    '/forgot-password',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email'
  ],
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
  const tokenFromCookie = request.cookies.get('auth-token')?.value
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const clientAuthStatus = request.headers.get('x-client-auth') === 'true'
  const token = tokenFromCookie || tokenFromHeader
  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/feed') || pathname.startsWith('/dashboard')
  const trustClientAuth = isAuthRoute && clientAuthStatus && !token
  if (!token) {
    return { 
      isAuthenticated: trustClientAuth || clientAuthStatus,
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
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }
  const authStatus = await getAuthStatus(request)
  const { isAuthenticated, token, isValid } = authStatus

  if (token && !isValid) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    response.cookies.delete('refresh-token')
    return response
  }

  if (isAuthenticated && matchesRoute(pathname, ROUTES.auth)) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  if (matchesRoute(pathname, ROUTES.admin)) {
    if (!isAuthenticated || !isValid) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('message', 'admin-required')
      return NextResponse.redirect(loginUrl)
    }

    const hasAdminRole = token ? await checkUserRole(token, 'admin') : false
    if (!hasAdminRole) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  if (matchesRoute(pathname, ROUTES.protected)) {
    if (token && isValid) {
    }
    else if (!token) {
    }    else if (!isAuthenticated && !request.headers.get('x-client-auth')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  if (isAuthenticated && isValid && token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      response.headers.set('X-User-ID', payload.sub as string)
      response.headers.set('X-User-Role', payload.role as string || 'user')
    } catch (error) {
      console.error('Failed to decode token for headers:', error)
    }
  }
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