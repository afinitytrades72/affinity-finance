import { NextResponse } from 'next/server';
import { exportThreadJSON } from '@/lib/db';

export async function GET(_req: Request, ctx: { params: Promise<{ threadId: string }> }) {
  try {
    const { threadId } = await ctx.params;
    const data = await exportThreadJSON(threadId);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
