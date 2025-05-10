import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiteHeader } from '@/components/layout/site-header';
import { TabBar } from '@/components/layout/tab-bar';
import { AuthProvider } from '@/contexts/auth-context';

const geistSans = GeistSans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FriendlyVoice',
  description: 'Conectando Personalidades, Amplificando Voces',
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SiteHeader />
            <main className="flex-grow container mx-auto px-4 py-8 pb-20 md:pb-8">
              {children}
            </main>
            <TabBar />
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
