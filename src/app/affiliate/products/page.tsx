'use client';

import { useState } from 'react';

const allProducts = [
  { id: 'PRD001', name: 'Samsung Galaxy S24 Ultra', price: '৳1,12,000', commission: '৳560', rate: '5%', category: 'Electronics', sales: 1240, rating: 4.7 },
  { id: 'PRD002', name: 'iPhone 15 Pro Max', price: '৳1,38,000', commission: '৳690', rate: '5%', category: 'Electronics', sales: 980, rating: 4.8 },
  { id: 'PRD003', name: 'Men\'s Cotton T-Shirt', price: '৳560', commission: '৳28', rate: '5%', category: 'Fashion', sales: 3400, rating: 4.3 },
  { id: 'PRD004', name: 'Women\'s Winter Jacket', price: '৳2,400', commission: '৳120', rate: '5%', category: 'Fashion', sales: 890, rating: 4.5 },
  { id: 'PRD005', name: 'Wireless Bluetooth Earbuds', price: '৳850', commission: '৳42.50', rate: '5%', category: 'Electronics', sales: 2100, rating: 4.4 },
  { id: 'PRD006', name: 'Smart Watch Ultra', price: '৳8,500', commission: '৳425', rate: '5%', category: 'Electronics', sales: 650, rating: 4.6 },
  { id: 'PRD007', name: 'Casio Digital Watch', price: '৳360', commission: '৳18', rate: '5%', category: 'Fashion', sales: 4200, rating: 4.2 },
  { id: 'PRD008', name: 'Protein Powder 1kg', price: '৳1,800', commission: '৳90', rate: '5%', category: 'Health', sales: 1500, rating: 4.5 },
];

export default function AffiliateProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popular');

  const filtered = allProducts
    .filter((p) => category === 'All' || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#222]">Products to Promote</h1>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." className="w-full px-3 py-2 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-[#ddd] rounded-lg text-sm">
          <option>All</option><option>Electronics</option><option>Fashion</option><option>Health</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 border border-[#ddd] rounded-lg text-sm">
          <option value="popular">Most Popular</option><option value="commission">Highest Commission</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-[#eee] p-4 hover:shadow-md transition-shadow">
            <div className="w-full h-32 bg-[#f5f5f5] rounded-lg mb-3 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ccc] text-4xl">inventory_2</span>
            </div>
            <p className="text-sm font-medium text-[#333] line-clamp-2 min-h-[2.5rem]">{p.name}</p>
            <p className="text-lg font-bold text-[#222] mt-1">{p.price}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {p.commission} commission
              </span>
              <span className="text-xs text-[#888]">{p.rate}</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#eee]">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">star</span>
                <span className="text-xs font-medium text-[#555]">{p.rating}</span>
                <span className="text-xs text-[#888]">({p.sales})</span>
              </div>
              <button className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary/90">
                Promote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
