'use client';

import { useState } from 'react';

const mockRoles = [
  { id: 'role-1', name: 'Super Admin', description: 'Full system access', users: 2, protected: true },
  { id: 'role-2', name: 'Admin', description: 'Administrative access', users: 8, protected: true },
  { id: 'role-3', name: 'Moderator', description: 'Content moderation access', users: 15, protected: false },
  { id: 'role-4', name: 'Support Agent', description: 'Ticket support access', users: 12, protected: false },
  { id: 'role-5', name: 'Seller Manager', description: 'Seller management access', users: 5, protected: false },
];

const modules = ['Dashboard', 'Products', 'Orders', 'Users', 'Sellers', 'Marketing', 'CMS', 'Settings', 'Reports'];

const permissions: Record<string, Record<string, boolean>> = {
  'Super Admin': Object.fromEntries(modules.map((m) => [m, true])),
  'Admin': { Dashboard: true, Products: true, Orders: true, Users: true, Sellers: true, Marketing: true, CMS: true, Settings: true, Reports: true },
  'Moderator': { Dashboard: true, Products: true, Orders: true, Users: false, Sellers: false, Marketing: false, CMS: true, Settings: false, Reports: false },
  'Support Agent': { Dashboard: true, Products: false, Orders: true, Users: true, Sellers: false, Marketing: false, CMS: false, Settings: false, Reports: false },
  'Seller Manager': { Dashboard: true, Products: false, Orders: false, Users: false, Sellers: true, Marketing: false, CMS: false, Settings: false, Reports: false },
};

export default function RolesPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Roles & Permissions</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">+ Create Role</button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-[#eee] p-5">
          <h2 className="text-lg font-semibold text-[#222] mb-4">Create New Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#666] mb-1">Role Name</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="e.g. Editor" />
            </div>
            <div>
              <label className="block text-sm text-[#666] mb-1">Description</label>
              <input type="text" className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm outline-none" placeholder="Brief description" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-[#666] hover:bg-[#f5f5f5] rounded-lg">Cancel</button>
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">Create Role</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
              <th className="p-3">Role Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Users</th>
              <th className="p-3">Protected</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRoles.map((r) => (
              <tr key={r.id} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                <td className="p-3 font-medium text-[#333]">{r.name}</td>
                <td className="p-3 text-[#666]">{r.description}</td>
                <td className="p-3 text-[#666]">{r.users}</td>
                <td className="p-3">
                  {r.protected ? (
                    <span className="material-symbols-outlined text-green-500 text-[18px]">shield</span>
                  ) : (
                    <span className="text-[#ccc]">—</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {!r.protected && (
                      <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">delete</span></button>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-[#f5f5f5]"><span className="material-symbols-outlined text-[18px] text-[#666]">edit</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-[#eee] overflow-x-auto">
        <div className="p-5 border-b border-[#eee]">
          <h2 className="text-lg font-semibold text-[#222]">Permission Matrix</h2>
          <p className="text-sm text-[#888] mt-1">Configure module-level permissions for each role</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-[#888] text-xs uppercase tracking-wider bg-[#fafafa] border-b border-[#eee]">
                <th className="p-3 sticky left-0 bg-[#fafafa]">Module</th>
                {mockRoles.map((r) => (
                  <th key={r.id} className="p-3 text-center">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod} className="border-b border-[#f5f5f5] hover:bg-[#fafafa]">
                  <td className="p-3 font-medium text-[#333] sticky left-0 bg-white">{mod}</td>
                  {mockRoles.map((r) => {
                    const checked = permissions[r.name]?.[mod] || false;
                    return (
                      <td key={r.id} className="p-3 text-center">
                        {r.protected ? (
                          <span className={`material-symbols-outlined text-[18px] ${checked ? 'text-green-500' : 'text-[#ddd]'}`}>
                            {checked ? 'check_box' : 'check_box_outline_blank'}
                          </span>
                        ) : (
                          <button className="p-1">
                            <span className={`material-symbols-outlined text-[18px] ${checked ? 'text-green-500' : 'text-[#ddd]'}`}>
                              {checked ? 'check_box' : 'check_box_outline_blank'}
                            </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
