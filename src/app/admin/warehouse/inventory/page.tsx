'use client';

import { useState } from 'react';

interface BinItem {
  binId: string;
  code: string;
  zone: string;
  items: { inventoryId: string; productId: string; productName: string; quantity: number }[];
}

export default function InventoryPage() {
  const [selectedZone, setSelectedZone] = useState('A');

  const mockBins: BinItem[] = [
    { binId: 'b1', code: 'A-01-01-01', zone: 'A', items: [{ inventoryId: 'i1', productId: 'p1', productName: 'Samsung Galaxy S25', quantity: 24 }] },
    { binId: 'b2', code: 'A-01-01-02', zone: 'A', items: [{ inventoryId: 'i2', productId: 'p2', productName: 'iPhone 16 Pro', quantity: 15 }] },
    { binId: 'b3', code: 'B-01-01-01', zone: 'B', items: [{ inventoryId: 'i3', productId: 'p3', productName: 'Sony WH-1000XM6', quantity: 8 }] },
    { binId: 'b4', code: 'B-01-01-02', zone: 'B', items: [{ inventoryId: 'i4', productId: 'p4', productName: 'MacBook Air M4', quantity: 5 }] },
    { binId: 'b5', code: 'C-01-01-01', zone: 'C', items: [{ inventoryId: 'i5', productId: 'p5', productName: 'AirPods Pro 3', quantity: 42 }] },
  ];

  const zones = ['A', 'B', 'C', 'D'];
  const filtered = selectedZone ? mockBins.filter(b => b.zone === selectedZone) : mockBins;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Inventory by Bin</h1>
        <div className="flex gap-2">
          {zones.map(z => (
            <button key={z} onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors ${selectedZone === z ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-container-highest'}`}>
              Zone {z}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(bin => (
          <div key={bin.binId} className="bg-surface rounded-xl border border-outline-variant p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-title-sm text-on-surface font-semibold">{bin.code}</p>
                <p className="text-label-bold text-on-surface-variant uppercase">Zone {bin.zone}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">shelves</span>
            </div>
            <div className="space-y-2">
              {bin.items.map(item => (
                <div key={item.inventoryId} className="flex justify-between items-center py-2 px-3 bg-surface-container-low rounded-lg">
                  <div>
                    <p className="text-body-sm text-on-surface font-medium">{item.productName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-body-sm font-semibold text-primary">{item.quantity}</span>
                    <button className="text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
