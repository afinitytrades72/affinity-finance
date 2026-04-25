import { NextResponse } from 'next/server';
import { createEmail } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fromName, fromEmail, to, subject, body: emailBody } = body;
    if (!fromName || !fromEmail || !to || !to.length || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields: fromName, fromEmail, to, subject, body' },
        { status: 400 }
      );
    }
    const email = await createEmail(body);
    return NextResponse.json(email, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
