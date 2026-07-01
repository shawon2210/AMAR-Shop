'use client';

import { useState, useMemo } from 'react';
import { useAdminData, useAdminData as useAdminDataRaw } from '@/lib/api/hooks';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api/admin';

interface CatNode {
  id: string;
  name: string;
  bnName: string | null;
  slug: string;
  icon: string | null;
  productCount: number;
  parentId: string | null;
  children: CatNode[];
}

function buildTree(cats: any[]): CatNode[] {
  const map = new Map<string, CatNode>();
  const roots: CatNode[] = [];

  for (const c of cats) {
    map.set(c.id, {
      id: c.id,
      name: c.name,
      bnName: (c as any).bnName || null,
      slug: c.slug,
      icon: c.icon || 'category',
      productCount: c._count?.products || 0,
      parentId: c.parentId,
      children: [],
    });
  }

  for (const c of cats) {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function TreeNode({ node, depth, onEdit, onDelete }: {
  node: CatNode;
  depth: number;
  onEdit: (c: CatNode) => void;
  onDelete: (id: string) => void;
}) {
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
          {node.bnName && <span className="text-xs text-[#999] ml-2">({node.bnName})</span>}
        </div>
        <span className="text-xs text-[#888] font-mono">{node.slug}</span>
        <span className="text-xs text-[#888] w-16 text-right">{node.productCount.toLocaleString()}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(node)} className="p-1 rounded hover:bg-[#eee]" title="Edit">
            <span className="material-symbols-outlined text-[16px] text-[#666]">edit</span>
          </button>
          <button onClick={() => onDelete(node.id)} className="p-1 rounded hover:bg-[#eee]" title="Delete">
            <span className="material-symbols-outlined text-[16px] text-[#666]">delete</span>
          </button>
        </div>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [view, setView] = useState<'tree' | 'table'>('tree');
  const [formMode, setFormMode] = useState<'none' | 'create' | 'edit'>('none');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', bnName: '', slug: '', icon: '', parentId: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, error, refetch } = useAdminData(fetchCategories);
  const tree = useMemo(() => (data ? buildTree(data) : []), [data]);

  const allCats = data || [];

  const resetForm = () => {
    setForm({ name: '', bnName: '', slug: '', icon: '', parentId: '' });
    setEditId(null);
    setFormMode('none');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      if (formMode === 'edit' && editId) {
        await updateCategory(editId, form);
      } else {
        await createCategory(form);
      }
      resetForm();
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (node: CatNode) => {
    setEditId(node.id);
    setForm({
      name: node.name,
      bnName: node.bnName || '',
      slug: node.slug,
      icon: node.icon || '',
      parentId: node.parentId || '',
    });
    setFormMode('edit');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Categories</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#f0f0f0] rounded-lg p-0.5">
            <button onClick={() => setView('tree')} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === 'tree' ? 'bg-white shadow-sm' : 'text-[#666]'}`}>Tree</button>
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === 'table' ? 'bg-white shadow-sm' : 'text-[#666]'}`}>Table</button>
          </div>
          <button onClick={() => { resetForm(); setFormMode('create'); }} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Add Category</button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {formMode !== 'none' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">{formMode === 'create' ? 'Add New Category' : 'Edit Category'}</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Name *"
                required
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none flex-1"
              />
              <input
                value={form.bnName}
                onChange={(e) => setForm((f) => ({ ...f, bnName: e.target.value }))}
                placeholder="Bengali Name"
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none flex-1"
              />
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="Slug"
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none flex-1"
              />
              <input
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="Icon"
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none w-24"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={form.parentId}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                className="border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="">Parent: None</option>
                {allCats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting || !form.name.trim()}
                className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : formMode === 'create' ? 'Add' : 'Update'}
              </button>
              <button type="button" onClick={resetForm} className="px-3 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>
          Loading...
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#eee]">
          {view === 'tree' ? (
            <div className="p-2">
              {tree.length === 0 ? (
                <p className="p-6 text-center text-[#888] text-sm">No categories found</p>
              ) : (
                tree.map((node) => (
                  <TreeNode key={node.id} node={node} depth={0} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
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
                {allCats.map((c: any) => (
                  <tr key={c.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                    <td className="p-3 font-medium text-[#333]">{c.name}</td>
                    <td className="p-3 text-[#666]">{c.bnName || '—'}</td>
                    <td className="p-3 text-[#888] font-mono text-xs">{c.slug}</td>
                    <td className="p-3">
                      <span className="material-symbols-outlined text-[18px] text-[#888]">{c.icon || 'category'}</span>
                    </td>
                    <td className="p-3 text-[#666]">{c.parent?.name || '—'}</td>
                    <td className="p-3 text-[#666]">{(c._count?.products || 0).toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => {
                          setEditId(c.id);
                          setForm({ name: c.name, bnName: c.bnName || '', slug: c.slug, icon: c.icon || '', parentId: c.parentId || '' });
                          setFormMode('edit');
                        }} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]">
                          <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
