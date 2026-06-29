'use client';

import { useState } from 'react';

export default function ApiKeysPage() {
  const [keys] = useState([
    { id: '1', name: 'Production Key', key: 'amarshop_abc...', isActive: true, lastUsed: '2 mins ago', createdAt: '2026-06-01' },
    { id: '2', name: 'Staging Key', key: 'amarshop_def...', isActive: true, lastUsed: '1 hour ago', createdAt: '2026-06-10' },
    { id: '3', name: 'Development Key', key: 'amarshop_ghi...', isActive: false, lastUsed: '3 days ago', createdAt: '2026-05-15' },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Create API Key</button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New API Key</h2>
          <div className="flex gap-3">
            <input
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter key name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Generate</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {keys.map((key) => (
          <div key={key.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
            <div>
              <p className="font-medium text-gray-900">{key.name}</p>
              <p className="text-sm text-gray-500 font-mono">{key.key}</p>
              <p className="text-xs text-gray-400 mt-1">Created {key.createdAt} &middot; Last used {key.lastUsed}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${key.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {key.isActive ? 'Active' : 'Revoked'}
              </span>
              <button className="text-sm text-red-600 hover:underline">Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
