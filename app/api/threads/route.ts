import { NextResponse } from 'next/server';
import { getThreads } from '@/lib/db';

export async function GET() {
  try {
    const threads = await getThreads();
    return NextResponse.json(threads);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
