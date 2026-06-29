import Link from 'next/link';
import { categories } from '@/lib/data/categories';

export function CategoryGrid() {
  return (
    <section className="mt-lg px-container-margin">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-md">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-fixed rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              <span className="material-symbols-outlined text-2xl md:text-3xl">{cat.icon}</span>
            </div>
            <span className="font-label-bold text-center">{cat.bnName}</span>
            <span className="text-[10px] text-secondary -mt-1">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
