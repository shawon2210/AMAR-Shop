'use client';

import { useState } from 'react';

const inventoryData = [
  { id: 1, name: 'iPhone 15 Pro Max', sku: 'APL-IP15PM', stock: 45, reserved: 3, warehouse: 'Dhaka Central', updated: '2026-06-28', threshold: 10 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', sku: 'SAM-S24U', stock: 32, reserved: 5, warehouse: 'Dhaka Central', updated: '2026-06-28', threshold: 10 },
  { id: 3, name: 'Sony WH-1000XM5', sku: 'SNY-WH1000', stock: 0, reserved: 0, warehouse: 'Chittagong Port', updated: '2026-06-27', threshold: 5 },
  { id: 4, name: 'Nike Air Max 270', sku: 'NKE-AM270', stock: 12, reserved: 2, warehouse: 'Dhaka Central', updated: '2026-06-27', threshold: 10 },
  { id: 5, name: 'Wooden Dining Table Set', sku: 'WDS-TBL01', stock: 8, reserved: 1, warehouse: 'Dhaka Central', updated: '2026-06-26', threshold: 5 },
  { id: 6, name: 'Dyson V15 Vacuum Cleaner', sku: 'DSN-V15', stock: 3, reserved: 1, warehouse: 'Chittagong Port', updated: '2026-06-26', threshold: 5 },
  { id: 7, name: 'MacBook Pro M3 Pro', sku: 'APL-MBP-M3', stock: 18, reserved: 2, warehouse: 'Dhaka Central', updated: '2026-06-25', threshold: 5 },
  { id: 8, name: 'Casio G-Shock GA-2100', sku: 'CSO-GSHOCK', stock: 55, reserved: 8, warehouse: 'Dhaka Central', updated: '2026-06-25', threshold: 15 },
];

function getStockLevel(stock: number): { color: string; label: string } {
  if (stock === 0) return { color: 'text-error', label: 'Out of Stock' };
  if (stock < 5) return { color: 'text-red-600', label: 'Critical' };
  if (stock < 10) return { color: 'text-amber-600', label: 'Low' };
  return { color: 'text-green-600', label: 'In Stock' };
}

function getStockBg(stock: number): string {
  if (stock > 20) return 'bg-green-100';
  if (stock >= 5) return 'bg-amber-100';
  return 'bg-red-100';
}

export default function SellerInventory() {
  const [search, setSearch] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<typeof inventoryData[0] | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);

  const filtered = inventoryData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = inventoryData.filter((item) => item.stock <= item.threshold);

  const openAdjust = (item: typeof inventoryData[0]) => {
    setAdjustProduct(item);
    setAdjustQty(item.stock);
    setShowAdjustModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-on-surface">Inventory</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-outline text-on-surface font-medium hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Low stock alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-error">warning</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Low Stock Alert</p>
              <p className="text-xs text-red-600 mt-0.5">
                {lowStockItems.length} product(s) are running low on stock. Reorder soon to avoid stockouts.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {lowStockItems.slice(0, 4).map((item) => (
                  <span key={item.id} className="text-xs bg-white px-2 py-1 rounded-full border border-red-200 text-red-700">
                    {item.name} ({item.stock} left)
                  </span>
                ))}
              </div>
            </div>
            <button className="text-xs text-red-700 font-medium hover:underline">Dismiss</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-lg">search</span>
        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-xl border border-surface-container-high shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-on-surface-variant text-xs border-b border-surface-container-high bg-surface-container-low">
              <th className="p-3 font-medium">Product</th>
              <th className="p-3 font-medium">SKU</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Reserved</th>
              <th className="p-3 font-medium">Available</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Warehouse</th>
              <th className="p-3 font-medium">Last Updated</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const available = item.stock - item.reserved;
              const level = getStockLevel(item.stock);
              return (
                <tr key={item.id} className="border-b border-surface-container-high last:border-b-0 hover:bg-surface-container-low">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.stock > 20 ? 'bg-green-500' : item.stock >= 5 ? 'bg-amber-500' : 'bg-red-500'}`} />
                      <span className="font-medium text-on-surface">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-on-surface-variant font-mono text-xs">{item.sku}</td>
                  <td className="p-3">
                    <span className={`font-medium ${level.color}`}>{item.stock}</span>
                  </td>
                  <td className="p-3 text-on-surface">{item.reserved}</td>
                  <td className="p-3 text-on-surface font-medium">{available}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-full h-2 rounded-full ${getStockBg(item.stock)} max-w-[60px]`}>
                        <div
                          className={`h-full rounded-full ${item.stock > 20 ? 'bg-green-500' : item.stock >= 5 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, (item.stock / 60) * 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${level.color}`}>{level.label}</span>
                    </div>
                  </td>
                  <td className="p-3 text-on-surface-variant">{item.warehouse}</td>
                  <td className="p-3 text-on-surface-variant">{item.updated}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openAdjust(item)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit_square</span>
                      Adjust
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && adjustProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdjustModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-on-surface">Adjust Stock</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-1">Product: <span className="font-medium text-on-surface">{adjustProduct.name}</span></p>
            <p className="text-xs text-on-surface-variant mb-4">SKU: {adjustProduct.sku} | Current Stock: <span className="font-medium">{adjustProduct.stock}</span></p>
            <div className="mb-4">
              <label className="text-sm font-medium text-on-surface block mb-1">New Stock Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdjustQty(Math.max(0, adjustQty - 1))}
                  className="p-2 rounded-lg border border-outline hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                  className="w-24 text-center px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  onClick={() => setAdjustQty(adjustQty + 1)}
                  className="p-2 rounded-lg border border-outline hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1">Reason for Adjustment</label>
              <select className="w-full px-3 py-2 text-sm rounded-lg border border-outline bg-white text-on-surface focus:ring-2 focus:ring-primary outline-none">
                <option value="">Select reason</option>
                <option value="restock">Restock</option>
                <option value="return">Customer Return</option>
                <option value="damage">Damaged / Discrepancy</option>
                <option value="manual">Manual Count</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-outline text-on-surface font-medium hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-container transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
