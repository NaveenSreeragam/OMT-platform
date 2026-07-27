'use client';

import React, { useState } from 'react';
import { updateUserRoleAction, toggleUserActiveAction } from '@/actions/users';
import { UserCheck, Shield, Search, Power } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AdminUsersClientProps {
  users: any[];
}

export function AdminUsersClient({ users }: AdminUsersClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleRoleChange(userId: string, currentRole: string) {
    const nextRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!confirm(`Are you sure you want to change this user's role to ${nextRole.toUpperCase()}?`)) return;
    await updateUserRoleAction(userId, nextRole as any);
  }

  async function handleToggleActive(userId: string, is_active: boolean) {
    await toggleUserActiveAction(userId, is_active);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User & Role Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage registered accounts and assign Admin privileges.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#00629B]"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">User Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">{user.full_name}</td>
                    <td className="py-4 px-6 text-slate-600 text-xs">{user.email}</td>
                    <td className="py-4 px-6 text-slate-600 text-xs">{user.department || 'N/A'}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{formatDate(user.created_at)}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-[#00629B]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleRoleChange(user.id, user.role)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                      >
                        Make {user.role === 'admin' ? 'Student' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
