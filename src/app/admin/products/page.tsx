'use client';

import { useState } from 'react';

const mockProducts = [
  { id: '#PRD-001', image: '', name: 'Samsung Galaxy S24 Ultra', seller: 'TechHaven BD', category: 'Electronics', price: '৳1,29,000', stock: 45, status: 'Active' },
  { id: '#PRD-002', image: '', name: 'Men\'s Cotton Panjabi', seller: 'Fashion Hub', category: 'Fashion', price: '৳1,890', stock: 200, status: 'Active' },
  { id: '#PRD-003', image: '', name: 'Wireless Bluetooth Earbuds', seller: 'Gadget Pro', category: 'Electronics', price: '৳3,200', stock: 0, status: 'Pending' },
  { id: '#PRD-004', image: '', name: 'Handcrafted Wooden Showpiece', seller: 'Home Decor Ltd', category: 'Home', price: '৳2,500', stock: 15, status: 'Active' },
  { id: '#PRD-005', image: '', name: 'Bengali Novel - Hajar Bochor', seller: 'Book Nook', category: 'Books', price: '৳450', stock: 500, status: 'Inactive' },
  { id: '#PRD-006', image: '', name: 'Organic Green Tea (100 Pack)', seller: 'Organic Foods BD', category: 'Food', price: '৳850', stock: 320, status: 'Rejected' },
  { id: '#PRD-007', image: '', name: 'Smart LED TV 55 Inch', seller: 'TechHaven BD', category: 'Electronics', price: '৳65,000', stock: 12, status: 'Active' },
  { id: '#PRD-008', image: '', name: 'Women\'s Silk Sharee', seller: 'Fashion Hub', category: 'Fashion', price: '৳8,500', stock: 30, status: 'Pending' },
  { id: '#PRD-009', image: '', name: 'Stainless Steel Cookware Set', seller: 'Home Decor Ltd', category: 'Home', price: '৳5,200', stock: 60, status: 'Active' },
  { id: '#PRD-010', image: '', name: 'Digital Bathroom Scale', seller: 'Gadget Pro', category: 'Electronics', price: '৳1,200', stock: 80, status: 'Active' },
];

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-700',
  Inactive: 'bg-gray-100 text-gray-700',
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((p) => p.id));
  };

  const pendingCount = mockProducts.filter((p) => p.status === 'Pending').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Products</h1>
        <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">{pendingCount} Pending Review</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-[#ddd] rounded-lg px-3 py-2 flex-1 max-w-md">
          <span className="material-symbols-outlined text-[#888] text-[20px]">search</span>
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm flex-1" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-white border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
          <option value="Food">Food</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 text-sm bg-primary/10 text-primary px-4 py-2 rounded-lg">
          <span className="font-medium">{selected.length} selected</span>
          <button className="px-3 py-1 bg-primary text-white rounded-md text-xs">Approve</button>
          <button className="px-3 py-1 bg-red-500 text-white rounded-md text-xs">Reject</button>
          <button onClick={() => setSelected([])} className="text-[#888] hover:text-[#333]">Clear</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3 w-10">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="accent-primary" />
              </th>
              <th className="p-3">Product</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3">
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="accent-primary" />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f0f0f0] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#888] text-[20px]">inventory_2</span>
                    </div>
                    <span className="font-medium text-[#333] max-w-[200px] truncate">{p.name}</span>
                  </div>
                </td>
                <td className="p-3 text-[#555]">{p.seller}</td>
                <td className="p-3 text-[#666]">{p.category}</td>
                <td className="p-3 font-medium">{p.price}</td>
                <td className="p-3">
                  <span className={p.stock === 0 ? 'text-red-500 font-medium' : 'text-[#666]'}>{p.stock === 0 ? 'Out of Stock' : p.stock}</span>
                </td>
                <td className="p-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[p.status]}`}>{p.status}</span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    {p.status === 'Pending' && (
                      <>
                        <button className="text-[11px] bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">Approve</button>
                        <button className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">Reject</button>
                      </>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Edit">
                      <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
