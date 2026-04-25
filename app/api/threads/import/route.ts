import { NextResponse } from 'next/server';
import { importThreadJSON } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { emails } = await req.json();
    if (!emails || !emails.length) {
      return NextResponse.json({ error: 'No emails provided' }, { status: 400 });
    }
    const thread = await importThreadJSON(emails);
    return NextResponse.json(thread, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
