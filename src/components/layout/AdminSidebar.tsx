'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, ClipboardEdit, Award, UserCheck, LogOut, Menu, X } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

interface AdminSidebarProps {
  adminName?: string;
  adminEmail?: string;
}

export function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Participants', href: '/admin/participants', icon: Users },
    { name: 'Scores', href: '/admin/scores', icon: ClipboardEdit },
    { name: 'Leaderboard', href: '/admin/leaderboard', icon: Award },
    { name: 'Users', href: '/admin/users', icon: UserCheck },
  ];

  return (
    <>
    <aside className="hidden w-64 shrink-0 bg-slate-900 text-slate-300 min-h-screen flex-col justify-between p-4 sticky top-0 h-screen md:flex">
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
      <div className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 shadow-sm md:hidden">
        <Link href="/admin/dashboard" className="flex items-center space-x-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00629B] text-sm font-bold text-white">ADM</div><span className="text-sm font-bold text-white">IEEE Admin Portal</span></Link>
        <button type="button" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open navigation menu" className="rounded-lg p-2 text-white hover:bg-slate-800"><Menu className="h-6 w-6" /></button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close navigation menu" onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/60" />
          <aside className="relative flex h-full w-72 flex-col justify-between bg-slate-900 p-4 text-slate-300 shadow-2xl">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-slate-800 px-2 py-3"><div><p className="text-sm font-bold text-white">IEEE Admin Portal</p><p className="text-xs text-slate-400">One Minute Talk Admin</p></div><button type="button" onClick={() => setIsMobileMenuOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"><X className="h-5 w-5" /></button></div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium ${isActive ? 'bg-[#00629B] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}><Icon className="h-5 w-5" /><span>{item.name}</span></Link>;
                })}
              </nav>
            </div>
            <div className="border-t border-slate-800 pt-4"><div className="mb-2 px-3 py-2"><p className="truncate text-sm font-semibold text-white">{adminName || 'Admin User'}</p><p className="truncate text-xs text-slate-400">{adminEmail || 'admin@ieee.org'}</p></div><button onClick={() => logoutAction()} className="flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-red-400 hover:bg-slate-800"><LogOut className="h-5 w-5" /><span>Logout</span></button></div>
          </aside>
        </div>
      )}
    </>
  );
}
