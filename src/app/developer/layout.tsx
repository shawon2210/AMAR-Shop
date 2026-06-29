import Link from 'next/link';

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Developer</h2>
        <nav className="space-y-1">
          <Link href="/developer" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">Overview</Link>
          <Link href="/developer/api-keys" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">API Keys</Link>
          <Link href="/developer/webhooks" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">Webhooks</Link>
          <Link href="/developer/docs" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">Documentation</Link>
          <Link href="/developer/playground" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">API Playground</Link>
          <Link href="/developer/usage" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600">Usage</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
