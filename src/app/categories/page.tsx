import { categories } from '@/lib/data/categories';
import Link from 'next/link';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex flex-col items-center p-4 bg-surface rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <span className="material-symbols-outlined text-4xl mb-2 text-primary">
              {category.icon}
            </span>
            <span className="font-medium text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}