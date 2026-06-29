import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('karacol_admin')?.value
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
    // token exists — allow. (For stronger checks, validate token with Supabase server-side.)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
