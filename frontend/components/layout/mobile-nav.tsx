'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/map', key: 'nav.map' },
  { href: '/catalog', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
] as const;

export function MobileNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation('common');

  return (
    <nav className="flex flex-col gap-1 p-4" aria-label="Navigation mobile">
      {NAV.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.key}
            href={asRoute(item.href)}
            onClick={onNavigate}
            className={cn(
              'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'bg-virunga-green text-white'
                : 'text-stone-700 hover:bg-stone-100',
            )}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
