import { NextRequest, NextResponse } from 'next/server';

const AUTH_USER = process.env.AUTH_USER || 'administrator';
const AUTH_PASS = process.env.AUTH_PASS || '3vr&$TBu98bx%aEb^KXF';

export function proxy(req: NextRequest) {
  const header = req.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    if (user === AUTH_USER && pass === AUTH_PASS) {
      return NextResponse.next();
    }
  }
  return new NextResponse(JSON.stringify({ error: 'Authentication required' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const config = {
  matcher: '/api/:path*',
};
