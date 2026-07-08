import Link from 'next/link';

const stores = [
  {
    label: 'Google Play',
    href: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658l10.937 6.332-2.302 2.302-8.635-8.634z" />
      </svg>
    ),
  },
  {
    label: 'App Store',
    href: '#',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
];

export function AppDownload() {
  return (
    <div className="flex flex-row flex-wrap justify-center md:justify-start items-center gap-3">
      {stores.map((store) => (
        <Link
          key={store.label}
          href={store.href}
          className="inline-flex items-center justify-center gap-2 w-[140px] h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-700"
        >
          <span className="w-4 h-4 flex items-center justify-center shrink-0">{store.svg}</span>
          <div className="text-left leading-tight">
            <p className="text-[9px] text-gray-400">Download on</p>
            <p className="text-xs font-semibold leading-none">{store.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
