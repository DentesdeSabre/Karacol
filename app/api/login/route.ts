import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import supabaseAdmin from '../../../lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message || 'Authentication failed' }, { status: 401 })
  }

  const accessToken = data.session.access_token

  const res = NextResponse.json({ user: data.user })
  res.cookies.set({
    name: 'karacol_admin',
    value: accessToken || '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  return res
}
