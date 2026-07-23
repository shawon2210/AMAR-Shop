'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSellerProducts, useDeleteProduct, formattedPrice } from '@/services/seller';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  Active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  Inactive: 'bg-gray-100 text-gray-600',
  out_of_stock: 'bg-red-100 text-red-700',
  'Out of Stock': 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  Pending: 'bg-amber-100 text-amber-700',
};

export default function SellerProducts() {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSellerProducts({
    page,
    limit: 10,
    status: filter === 'All' ? undefined : filter,
    search: search || undefined,
  });

  const deleteProduct = useDeleteProduct();

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
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
        <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-1 overflow-x-auto">
          {['All', 'Active', 'Inactive', 'Out of Stock', 'Pending'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-md transition-colors ${
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-on-surface-variant">Loading products...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-4xl text-error mb-2">error</span>
          <p className="text-on-surface-variant">Failed to load products</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">inventory_2</span>
          <p className="text-on-surface-variant">No products found</p>
          <Link href="/seller/products/new" className="mt-3 text-sm text-primary font-medium hover:underline">Add your first product</Link>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.length === products.length && products.length > 0}
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
              {products.map((product) => (
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
                      <img
                        src={product.images?.[0] || 'https://picsum.photos/seed/default/80/80'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-surface-container-high"
                      />
                      <div>
                        <p className="font-medium text-on-surface">{product.name}</p>
                        <p className="text-xs text-on-surface-variant">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-on-surface">{formattedPrice(product.price)}</td>
                  <td className="p-3">
                    <span className={`${product.stockCount === 0 ? 'text-error' : product.stockCount < 10 ? 'text-amber-600' : 'text-on-surface'}`}>
                      {product.stockCount}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColors[product.status] || 'bg-gray-100 text-gray-600'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3 text-on-surface">{product.soldCount}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => deleteProduct.mutate(product.id)}
                        className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors"
                      >
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
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img src={product.images?.[0] || 'https://picsum.photos/seed/default/80/80'} alt={product.name} className="w-full h-40 object-cover bg-surface-container-high" />
                <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[product.status] || 'bg-gray-100 text-gray-600'}`}>
                  {product.status}
                </span>
              </div>
              <div className="p-3">
                <p className="font-medium text-on-surface text-sm">{product.name}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{product.sku}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-on-surface">{formattedPrice(product.price)}</span>
                  <span className="text-xs text-on-surface-variant">{product.soldCount} sold</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-on-surface-variant">Stock:</span>
                  <span className={`text-xs font-medium ${product.stockCount === 0 ? 'text-error' : product.stockCount < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                    {product.stockCount}
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
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-outline text-on-surface disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === p
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-outline text-on-surface disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
