import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, user: process.env.AUTH_USER || 'administrator' });
}
