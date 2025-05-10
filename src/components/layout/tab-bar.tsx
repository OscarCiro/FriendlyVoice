'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/discover', label: 'Descubrir', icon: Compass },
  { href: '/messages', label: 'Mensajes', icon: MessageSquare },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/" && pathname.startsWith("/ecosystems"));
          return (
            <Link key={item.label} href={item.href} passHref>
              <div className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}>
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
