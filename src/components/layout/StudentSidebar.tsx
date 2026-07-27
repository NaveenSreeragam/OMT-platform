'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Award, Calendar, User, LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

interface SidebarProps {
  studentName?: string;
  studentEmail?: string;
}

export function StudentSidebar({ studentName, studentEmail }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Leaderboard', href: '/student/leaderboard', icon: Award },
    { name: 'My Sessions', href: '/student/sessions', icon: Calendar },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen">
      <div>
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-[#00629B] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            OMT
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-slate-900 text-sm truncate">IEEE Student Portal</h2>
            <p className="text-xs text-slate-500">Student Dashboard</p>
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
                    ? 'bg-[#00629B] text-white shadow-sm shadow-[#00629B]/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{studentName || 'Student'}</p>
          <p className="text-xs text-slate-500 truncate">{studentEmail || 'student@ieee.org'}</p>
        </div>
        <button
          onClick={() => logoutAction()}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
