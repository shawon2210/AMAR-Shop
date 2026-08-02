'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useSearchStore } from '@/stores/search-store';
import { useScrollState } from './hooks/use-scroll-state';
import { TopUtilityBar } from './components/TopUtilityBar';
import { Logo } from './components/Logo';
import { MobileSearchButton } from './components/MobileSearchButton';
import { DesktopSearch } from './components/DesktopSearch';
import { Actions } from './components/Actions';
import { CategoryNav } from './components/CategoryNav';
import { Z_HEADER } from './styles';

const NavigationDrawer = dynamic(
  () => import('./navigation/NavigationDrawer').then((m) => m.NavigationDrawer),
  { ssr: false },
);

const SearchOverlay = dynamic(
  () => import('./search/SearchOverlay').then((m) => m.SearchOverlay),
  { ssr: false },
);

export function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrolled = useScrollState(4);
  const headerRef = useRef<HTMLElement>(null);
  const { isOpen: searchOpen } = useSearchStore();

  return (
    <header
      ref={headerRef}
      className={
        'sticky top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800/70 transition-shadow duration-200 ' +
        (scrolled
          ? 'shadow-[0_1px_0_0_rgb(0_0_0/0.06),0_4px_16px_0_rgb(0_0_0/0.07)] dark:shadow-[0_1px_0_0_rgb(0_0_0/0.5),0_4px_16px_0_rgb(0_0_0/0.4)]'
          : '')
      }
      style={{ zIndex: searchOpen ? 'auto' : Z_HEADER }}
    >
      <TopUtilityBar />

      <div className="app-container">
        <div className="flex items-center gap-1.5 md:gap-3 lg:gap-6 h-16 md:h-18 lg:h-20">
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              aria-controls="navigation-drawer"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <Logo />
          </div>

          <DesktopSearch />

          <Actions />
        </div>

        <MobileSearchButton scrolled={scrolled} />
      </div>

      <CategoryNav />

      <NavigationDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SearchOverlay />
    </header>
  );
}
