'use client';

import { useState } from 'react';

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Automotive', 'Food'];

interface Variant {
  id: number;
  name: string;
  price: string;
  stock: string;
  sku: string;
}

export default function NewProduct() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: '', price: '', stock: '', sku: '' }]);
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: number, field: keyof Variant, value: string) => {
    setVariants(variants.map((v) => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages([...images, ...Array.from(files).map((f) => URL.createObjectURL(f))]);
    }
  };

  return (
    <div className="space-y-6 app-container">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-on-surface">Add New Product</h1>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm rounded-lg border border-outline text-on-surface font-medium hover:bg-surface-container-high transition-colors">
            Save as Draft
          </button>
          <button className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors">
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">Basic Information</h3>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Enter product description"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Price (৳)</label>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Compare Price (৳)</label>
                <input
                  type="text"
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Category</label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Brand</label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">SKU</label>
              <input
                type="text"
                placeholder="e.g. APL-IP15PM-256"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">Product Images</h3>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-outline'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const files = Array.from(e.dataTransfer.files);
                setImages([...images, ...files.map((f) => URL.createObjectURL(f))]);
              }}
            >
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">cloud_upload</span>
              <p className="text-sm text-on-surface-variant mb-1">Drag & drop images here or click to browse</p>
              <p className="text-xs text-on-surface-variant">Supports JPG, PNG, WebP (max 5MB each)</p>
              <label className="inline-block mt-3 px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium cursor-pointer hover:bg-primary-container transition-colors">
                Browse Files
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`Upload ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-surface-container-high" />
                    <button
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-on-surface">Variants (Optional)</h3>
              <button
                onClick={addVariant}
                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Add Variant
              </button>
            </div>
            {variants.length === 0 && (
              <p className="text-sm text-on-surface-variant">No variants added yet. Click &quot;Add Variant&quot; to create size, color, or other variations.</p>
            )}
            {variants.map((v) => (
              <div key={v.id} className="grid grid-cols-5 gap-3 p-3 rounded-lg bg-surface-container-low items-end">
                <div>
                  <label className="text-xs font-medium text-on-surface-variant block mb-1">Variant Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Red, Large"
                    value={v.name}
                    onChange={(e) => updateVariant(v.id, 'name', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant block mb-1">Price</label>
                  <input
                    type="text"
                    placeholder="৳0"
                    value={v.price}
                    onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant block mb-1">Stock</label>
                  <input
                    type="text"
                    placeholder="0"
                    value={v.stock}
                    onChange={(e) => updateVariant(v.id, 'stock', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-on-surface-variant block mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <button
                  onClick={() => removeVariant(v.id)}
                  className="p-2 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">SEO</h3>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Meta Title</label>
              <input
                type="text"
                placeholder="SEO title (60 char max)"
                maxLength={60}
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Meta Description</label>
              <textarea
                rows={3}
                placeholder="SEO description (160 char max)"
                maxLength={160}
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Inventory */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">Inventory</h3>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Stock Count</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Low Stock Alert Threshold</label>
              <input
                type="number"
                placeholder="10"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl p-5 border border-surface-container-high shadow-sm space-y-4">
            <h3 className="font-semibold text-on-surface">Shipping</h3>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Weight (kg)</label>
              <input
                type="text"
                placeholder="0.5"
                className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Length</label>
                <input type="text" placeholder="cm" className="w-full px-2 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Width</label>
                <input type="text" placeholder="cm" className="w-full px-2 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface block mb-1">Height</label>
                <input type="text" placeholder="cm" className="w-full px-2 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
