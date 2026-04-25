import type { Metadata } from 'next';
import './globals.css';
import 'react-quill-new/dist/quill.snow.css';

export const metadata: Metadata = {
  title: 'Gmail Simulator',
  description: 'Internal email simulator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
