'use client';

import { useState } from 'react';
import Link from 'next/link';

const allProducts = [
  { id: 1, name: 'iPhone 15 Pro Max', image: 'https://picsum.photos/seed/p1/80/80', price: '৳1,29,999', stock: 45, status: 'Active', sales: 234, sku: 'APL-IP15PM' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', image: 'https://picsum.photos/seed/p2/80/80', price: '৳1,19,999', stock: 32, status: 'Active', sales: 189, sku: 'SAM-S24U' },
  { id: 3, name: 'Sony WH-1000XM5 Headphones', image: 'https://picsum.photos/seed/p3/80/80', price: '৳32,999', stock: 0, status: 'Out of Stock', sales: 78, sku: 'SNY-WH1000' },
  { id: 4, name: 'Nike Air Max 270', image: 'https://picsum.photos/seed/p4/80/80', price: '৳16,999', stock: 12, status: 'Active', sales: 156, sku: 'NKE-AM270' },
  { id: 5, name: 'Wooden Dining Table Set', image: 'https://picsum.photos/seed/p5/80/80', price: '৳45,000', stock: 8, status: 'Inactive', sales: 23, sku: 'WDS-TBL01' },
  { id: 6, name: 'Dyson V15 Vacuum Cleaner', image: 'https://picsum.photos/seed/p6/80/80', price: '৳55,999', stock: 3, status: 'Pending', sales: 12, sku: 'DSN-V15' },
  { id: 7, name: 'MacBook Pro M3 Pro', image: 'https://picsum.photos/seed/p7/80/80', price: '৳2,49,999', stock: 18, status: 'Active', sales: 67, sku: 'APL-MBP-M3' },
  { id: 8, name: 'Casio G-Shock GA-2100', image: 'https://picsum.photos/seed/p8/80/80', price: '৳8,499', stock: 55, status: 'Active', sales: 312, sku: 'CSO-GSHOCK' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-600',
  'Out of Stock': 'bg-red-100 text-red-700',
  Pending: 'bg-amber-100 text-amber-700',
};

export default function SellerProducts() {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filtered = allProducts.filter((p) => {
    if (filter !== 'All' && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === paginated.length) {
      setSelected([]);
    } else {
      setSelected(paginated.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-on-surface">Products</h1>
        <Link
          href="/seller/products/new"
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Product
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-1">
          {['All', 'Active', 'Inactive', 'Out of Stock', 'Pending'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === f ? 'bg-white text-on-surface shadow-sm font-medium' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-lg">search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            className="p-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              {viewMode === 'table' ? 'grid_view' : 'table_rows'}
            </span>
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm text-on-surface font-medium">{selected.length} selected</span>
          <button className="text-sm text-primary font-medium hover:underline">Mark Active</button>
          <button className="text-sm text-primary font-medium hover:underline">Mark Inactive</button>
          <button className="text-sm text-error font-medium hover:underline">Delete</button>
        </div>
      )}

      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="rounded border-outline"
                  />
                </th>
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Sales</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => (
                <tr key={product.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded border-outline"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-surface-container-high" />
                      <div>
                        <p className="font-medium text-on-surface">{product.name}</p>
                        <p className="text-xs text-on-surface-variant">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-on-surface">{product.price}</td>
                  <td className="p-3">
                    <span className={`${product.stock === 0 ? 'text-error' : product.stock < 10 ? 'text-amber-600' : 'text-on-surface'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColors[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3 text-on-surface">{product.sales}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover bg-surface-container-high" />
                <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[product.status]}`}>
                  {product.status}
                </span>
              </div>
              <div className="p-3">
                <p className="font-medium text-on-surface text-sm">{product.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{product.sku}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-on-surface">{product.price}</span>
                  <span className="text-xs text-on-surface-variant">{product.sales} sold</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-on-surface-variant">Stock:</span>
                  <span className={`text-xs font-medium ${product.stock === 0 ? 'text-error' : product.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-outline text-on-surface disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-outline text-on-surface disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
