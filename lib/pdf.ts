import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DOMPurify from 'dompurify';
import type { Email } from './types';

function buildHtml(emails: Email[]): string {
  const subject = emails[0]?.subject || 'Email Thread';
  const messages = emails.map((email) => {
    const to = email.toRecipients.map((r) => `${escape(r.name)} &lt;${escape(r.email)}&gt;`).join(', ');
    const cc = email.ccRecipients.length
      ? `<div style="color:#5f6368;font-size:12px;margin-top:2px;">Cc: ${email.ccRecipients
          .map((r) => `${escape(r.name)} &lt;${escape(r.email)}&gt;`)
          .join(', ')}</div>`
      : '';
    const date = new Date(email.timestamp).toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    return `
      <div style="border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin-bottom:16px;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div>
            <div style="font-weight:600;font-size:14px;color:#202124;">${escape(email.fromName)} &lt;${escape(email.fromEmail)}&gt;</div>
            <div style="color:#5f6368;font-size:12px;margin-top:2px;">To: ${to}</div>
            ${cc}
          </div>
          <div style="color:#5f6368;font-size:12px;white-space:nowrap;">${escape(date)}</div>
        </div>
        <div style="font-size:14px;line-height:1.6;color:#202124;">${DOMPurify.sanitize(email.body)}</div>
      </div>
    `;
  }).join('');

  return `
    <div style="font-family:'Google Sans',Arial,sans-serif;background:#f6f8fc;padding:24px;width:680px;box-sizing:border-box;">
      <h1 style="font-size:22px;font-weight:400;color:#202124;margin:0 0 24px;padding-bottom:12px;border-bottom:1px solid #e0e0e0;">${escape(subject)}</h1>
      ${messages}
      <div style="text-align:center;color:#5f6368;font-size:11px;margin-top:24px;padding-top:12px;border-top:1px solid #e0e0e0;">
        Exported from Gmail Simulator &bull; ${new Date().toLocaleDateString()}
      </div>
    </div>
  `;
}

function escape(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] as string));
}

export async function exportThreadPDF(emails: Email[], filename: string): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.innerHTML = buildHtml(emails);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
      scale: 2,
      backgroundColor: '#f6f8fc',
      useCORS: true,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;

    let heightLeft = imgH;
    let position = 0;
    const dataUrl = canvas.toDataURL('image/png');

    pdf.addImage(dataUrl, 'PNG', 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
