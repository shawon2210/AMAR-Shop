'use client';

import { useMemo } from 'react';
import { useAdminData } from '@/lib/api/hooks';
import { fetchUsers } from '@/lib/api/admin';

export default function RolesPage() {
  const { data, loading, error } = useAdminData(() => fetchUsers({ limit: 1000 }));

  const roleGroups = useMemo(() => {
    if (!data?.users) return {};
    const groups: Record<string, number> = {};
    data.users.forEach((u) => {
      groups[u.role] = (groups[u.role] || 0) + 1;
    });
    return groups;
  }, [data]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#222]">Roles & Permissions</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm border border-red-200">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-[#eee] p-8 text-center text-[#888]">
          <span className="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span>Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(roleGroups).map(([role, count]) => (
            <div key={role} className="bg-white rounded-xl border border-[#eee] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                </div>
                <div>
                  <p className="font-semibold text-[#222]">{role}</p>
                  <p className="text-sm text-[#888]">{count} user{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#eee] p-5">
        <h2 className="font-semibold text-[#222] mb-4">Permission Notes</h2>
        <ul className="space-y-2 text-sm text-[#666]">
          <li>• <strong>SUPER_ADMIN</strong> — Full system access to all modules</li>
          <li>• <strong>ADMIN</strong> — Administrative access to all business modules</li>
          <li>• <strong>SELLER</strong> — Access to own store, products, and orders</li>
          <li>• <strong>CUSTOMER</strong> — Standard customer account access</li>
          <li>• Role-based access is enforced server-side via the <code>@Roles()</code> decorator</li>
          <li>• To change a user&apos;s role, go to <a href="/admin/users" className="text-primary hover:underline">Users</a> and edit their profile</li>
        </ul>
      </div>
    </div>
  );
}