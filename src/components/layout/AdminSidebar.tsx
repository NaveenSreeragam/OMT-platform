'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, ClipboardEdit, Award, UserCheck, LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

interface AdminSidebarProps {
  adminName?: string;
  adminEmail?: string;
}

export function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Participants', href: '/admin/participants', icon: Users },
    { name: 'Scores', href: '/admin/scores', icon: ClipboardEdit },
    { name: 'Leaderboard', href: '/admin/leaderboard', icon: Award },
    { name: 'Users', href: '/admin/users', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen">
      <div>
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-[#00629B] flex items-center justify-center text-white font-bold text-sm shadow-md">
            ADM
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-white text-sm truncate">IEEE Admin Portal</h2>
            <p className="text-xs text-slate-400">One Minute Talk Admin</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#00629B] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-semibold text-white truncate">{adminName || 'Admin User'}</p>
          <p className="text-xs text-slate-400 truncate">{adminEmail || 'admin@ieee.org'}</p>
        </div>
        <button
          onClick={() => logoutAction()}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
