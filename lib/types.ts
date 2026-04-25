export interface Recipient {
  name: string;
  email: string;
}

export interface Email {
  id: string;
  threadId: string;
  parentId: string | null;
  fromName: string;
  fromEmail: string;
  toRecipients: Recipient[];
  ccRecipients: Recipient[];
  bccRecipients: Recipient[];
  subject: string;
  body: string;
  timestamp: string;
  createdAt: string;
}

export interface ThreadSummary extends Email {
  messageCount: number;
}

export interface NewEmailInput {
  fromName: string;
  fromEmail: string;
  to: Recipient[];
  cc?: Recipient[];
  bcc?: Recipient[];
  subject: string;
  body: string;
  timestamp?: string;
  threadId?: string;
  parentId?: string | null;
}
