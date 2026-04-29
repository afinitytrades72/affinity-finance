import { NextResponse } from 'next/server';
import { getThread, deleteThread } from '@/lib/db';

export async function GET(_req: Request, ctx: { params: Promise<{ threadId: string }> }) {
  try {
    const { threadId } = await ctx.params;
    const thread = await getThread(threadId);
    if (!thread.length) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }
    return NextResponse.json(thread);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ threadId: string }> }) {
  try {
    const expected = process.env.DELETE_PASSWORD;
    if (!expected) {
      return NextResponse.json({ error: 'Delete is disabled (DELETE_PASSWORD not set)' }, { status: 403 });
    }
    const provided = req.headers.get('x-delete-password');
    if (provided !== expected) {
      return NextResponse.json({ error: 'Invalid delete password' }, { status: 403 });
    }
    const { threadId } = await ctx.params;
    await deleteThread(threadId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
