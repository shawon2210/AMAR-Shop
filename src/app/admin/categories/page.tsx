'use client';

import { useState } from 'react';

interface CategoryNode {
  id: string;
  name: string;
  bnName: string;
  slug: string;
  icon: string;
  productCount: number;
  children: CategoryNode[];
}

const categoryTree: CategoryNode[] = [
  {
    id: 'cat-1', name: 'Electronics', bnName: 'ইলেকট্রনিক্স', slug: 'electronics', icon: 'smartphone', productCount: 12450,
    children: [
      { id: 'cat-1-1', name: 'Mobile Phones', bnName: 'মোবাইল ফোন', slug: 'mobile-phones', icon: 'phone_android', productCount: 3200, children: [] },
      { id: 'cat-1-2', name: 'Laptops', bnName: 'ল্যাপটপ', slug: 'laptops', icon: 'laptop', productCount: 1800, children: [] },
      { id: 'cat-1-3', name: 'Audio', bnName: 'অডিও', slug: 'audio', icon: 'headphones', productCount: 2400, children: [] },
    ],
  },
  {
    id: 'cat-2', name: 'Fashion', bnName: 'ফ্যাশন', slug: 'fashion', icon: 'checkroom', productCount: 28400,
    children: [
      { id: 'cat-2-1', name: 'Men', bnName: 'পুরুষ', slug: 'fashion-men', icon: 'man', productCount: 8900, children: [] },
      { id: 'cat-2-2', name: 'Women', bnName: 'মহিলা', slug: 'fashion-women', icon: 'woman', productCount: 12000, children: [] },
      { id: 'cat-2-3', name: 'Kids', bnName: 'শিশু', slug: 'fashion-kids', icon: 'child_care', productCount: 7500, children: [] },
    ],
  },
  {
    id: 'cat-3', name: 'Home & Living', bnName: 'বাড়ি ও জীবন', slug: 'home-living', icon: 'chair', productCount: 15600,
    children: [
      { id: 'cat-3-1', name: 'Furniture', bnName: 'আসবাবপত্র', slug: 'furniture', icon: 'bed', productCount: 5200, children: [] },
      { id: 'cat-3-2', name: 'Decor', bnName: 'সজ্জা', slug: 'decor', icon: 'spa', productCount: 6400, children: [] },
    ],
  },
  {
    id: 'cat-4', name: 'Books', bnName: 'বই', slug: 'books', icon: 'menu_book', productCount: 8200, children: [],
  },
];

function TreeNode({ node, depth }: { node: CategoryNode; depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-3 py-2.5 px-3 hover:bg-[#fafafa] rounded-lg cursor-pointer group"
        style={{ paddingLeft: `${12 + depth * 24}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="p-0.5">
            <span className="material-symbols-outlined text-[18px] text-[#888]">
              {expanded ? 'expand_more' : 'chevron_right'}
            </span>
          </button>
        ) : (
          <div className="w-[22px]" />
        )}
        <span className="material-symbols-outlined text-[18px] text-[#888]">{node.icon}</span>
        <div className="flex-1">
          <span className="text-sm font-medium text-[#333]">{node.name}</span>
          <span className="text-xs text-[#999] ml-2">({node.bnName})</span>
        </div>
        <span className="text-xs text-[#888] font-mono">{node.slug}</span>
        <span className="text-xs text-[#888] w-16 text-right">{node.productCount.toLocaleString()}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 rounded hover:bg-[#eee]" title="Edit">
            <span className="material-symbols-outlined text-[16px] text-[#666]">edit</span>
          </button>
          <button className="p-1 rounded hover:bg-[#eee]" title="Delete">
            <span className="material-symbols-outlined text-[16px] text-[#666]">delete</span>
          </button>
        </div>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [view, setView] = useState<'tree' | 'table'>('tree');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Categories</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#f0f0f0] rounded-lg p-0.5">
            <button onClick={() => setView('tree')} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === 'tree' ? 'bg-white shadow-sm' : 'text-[#666]'}`}>Tree</button>
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm' : 'text-[#666]'}`}>Table</button>
          </div>
          <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Category</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#eee]">
        <div className="p-4 border-b border-[#eee]">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                placeholder="Name"
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none flex-1"
              />
              <input
                type="text"
                placeholder="Bengali Name"
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none flex-1"
              />
              <input
                type="text"
                placeholder="Slug"
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Icon"
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none w-24"
              />
              <select className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none">
                <option>Parent: None</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Living</option>
              </select>
              <button className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">Add</button>
            </div>
          </div>
        </div>

        {view === 'tree' ? (
          <div className="p-2">
            {categoryTree.map((node) => (
              <TreeNode key={node.id} node={node} depth={0} />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3">Name</th>
                <th className="p-3">Bengali</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Icon</th>
                <th className="p-3">Parent</th>
                <th className="p-3">Products</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Electronics', bn: 'ইলেকট্রনিক্স', slug: 'electronics', icon: 'smartphone', parent: '—', products: 12450 },
                { name: 'Mobile Phones', bn: 'মোবাইল ফোন', slug: 'mobile-phones', icon: 'phone_android', parent: 'Electronics', products: 3200 },
                { name: 'Laptops', bn: 'ল্যাপটপ', slug: 'laptops', icon: 'laptop', parent: 'Electronics', products: 1800 },
                { name: 'Fashion', bn: 'ফ্যাশন', slug: 'fashion', icon: 'checkroom', parent: '—', products: 28400 },
                { name: 'Men', bn: 'পুরুষ', slug: 'fashion-men', icon: 'man', parent: 'Fashion', products: 8900 },
                { name: 'Women', bn: 'মহিলা', slug: 'fashion-women', icon: 'woman', parent: 'Fashion', products: 12000 },
              ].map((c) => (
                <tr key={c.slug} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333]">{c.name}</td>
                  <td className="p-3 text-[#666]">{c.bn}</td>
                  <td className="p-3 text-[#888] font-mono text-xs">{c.slug}</td>
                  <td className="p-3">
                    <span className="material-symbols-outlined text-[18px] text-[#888]">{c.icon}</span>
                  </td>
                  <td className="p-3 text-[#666]">{c.parent}</td>
                  <td className="p-3 text-[#666]">{c.products.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">edit</span></button>
                      <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
