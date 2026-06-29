import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({ name: 'karacol_admin', value: '', httpOnly: true, path: '/', maxAge: 0 })
  return res
}
