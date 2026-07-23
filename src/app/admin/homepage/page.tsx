'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { AdminLoading, AdminError, AdminEmpty } from '@/components/ui/admin-states';
import { getErrorMessage } from '@/lib/error-helper';

interface HomepageSection {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  sortOrder: number;
  settings: Record<string, unknown>;
}

const sectionTypes = [
  { value: 'hero_banner', label: 'Hero Banner', icon: 'view_carousel' },
  { value: 'featured_categories', label: 'Featured Categories', icon: 'category' },
  { value: 'best_sellers', label: 'Best Sellers', icon: 'trending_up' },
  { value: 'new_arrivals', label: 'New Arrivals', icon: 'fiber_new' },
  { value: 'promo_banners', label: 'Promo Banners', icon: 'campaign' },
  { value: 'brand_logos', label: 'Brand Logos', icon: 'branding_watermark' },
];

const typeIcons: Record<string, string> = {};
sectionTypes.forEach((t) => { typeIcons[t.value] = t.icon; });

export default function AdminHomepagePage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notification, setNotification] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: 'hero_banner', title: '', subtitle: '' });
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<HomepageSection[]>('/admin/cms/sections');
      setSections(data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load sections'));
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const clearNotification = () => { setTimeout(() => setNotification(''), 3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/cms/sections', { sections });
      setNotification('Sections saved successfully');
      clearNotification();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await api.post('/admin/cms/sections/publish', { sections });
      setNotification('Homepage published successfully');
      clearNotification();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to publish'));
    } finally {
      setPublishing(false);
    }
  };

  const handleAdd = () => {
    const newSection: HomepageSection = {
      id: `section_${Date.now()}`,
      type: form.type,
      title: form.title,
      subtitle: form.subtitle,
      isActive: true,
      sortOrder: sections.length,
      settings: {},
    };
    setSections([...sections, newSection]);
    setForm({ type: 'hero_banner', title: '', subtitle: '' });
    setShowAddForm(false);
  };

  const handleUpdate = (id: string, updates: Partial<HomepageSection>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleRemove = (id: string) => {
    if (!confirm('Remove this section?')) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const toggleActive = (id: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const moveSection = (from: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setSections(updated.map((s, i) => ({ ...s, sortOrder: i })));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Homepage Editor</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setForm({ type: 'hero_banner', title: '', subtitle: '' }); setShowAddForm(!showAddForm); setEditId(null); }}
            className="px-4 py-2 bg-white border border-[#ddd] text-sm rounded-lg hover:bg-[#f5f5f5] text-[#666]"
          >
            + Add Section
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-green-50 text-green-700 rounded-lg p-3 text-sm border border-green-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {notification}
        </div>
      )}

      {error && <AdminError message={error} onRetry={fetchSections} />}

      {showAddForm && (
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Add New Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Section Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
              >
                {sectionTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Section title"
              />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Subtitle</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Section subtitle"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">
              Cancel
            </button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
              Add Section
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : sections.length === 0 ? (
        <AdminEmpty message="No homepage sections yet. Add your first section above." icon="dashboard_customize" />
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => { e.preventDefault(); setOverIndex(index); }}
              onDragEnd={() => {
                if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
                  moveSection(dragIndex, overIndex);
                }
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`bg-white rounded-xl border p-4 transition-all ${
                overIndex === index ? 'border-primary border-2' : 'border-[#eee]'
              } ${!section.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="cursor-grab text-[#bbb] hover:text-[#666]" title="Drag to reorder">
                  <span className="material-symbols-outlined">drag_indicator</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#888]">{typeIcons[section.type] || 'view_carousel'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#222] text-sm">{section.title || 'Untitled Section'}</h3>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#f0f0f0] text-[#888]">
                      {sectionTypes.find((t) => t.value === section.type)?.label || section.type}
                    </span>
                  </div>
                  {section.subtitle && (
                    <p className="text-xs text-[#888] mt-0.5">{section.subtitle}</p>
                  )}
                  <p className="text-[10px] text-[#aaa] mt-0.5">Order: #{section.sortOrder + 1}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(section.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title={section.isActive ? 'Deactivate' : 'Activate'}>
                    <span className="material-symbols-outlined text-[20px] text-[#666]">{section.isActive ? 'toggle_on' : 'toggle_off'}</span>
                  </button>
                  <button onClick={() => handleRemove(section.id)} className="p-1.5 rounded-lg hover:bg-[#f5f5f5]" title="Remove">
                    <span className="material-symbols-outlined text-[18px] text-[#666]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}