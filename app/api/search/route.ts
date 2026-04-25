import { NextResponse } from 'next/server';
import { searchEmails } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q');
    if (!q) return NextResponse.json([]);
    const results = await searchEmails(q);
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
