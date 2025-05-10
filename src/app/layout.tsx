import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/site-header';
import { TabBar } from '@/components/layout/tab-bar';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'FriendlyVoice',
  description: 'Conectando Personalidades, Amplificando Voces',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Providers>
          <SiteHeader />
          <main className="flex-grow container mx-auto px-4 py-8 pb-20 md:pb-8">
            {children}
          </main>
          <TabBar />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
