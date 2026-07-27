'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Calendar, BookOpen, Users, LogOut, ChevronRight } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

interface NavbarProps {
  userRole?: 'student' | 'admin';
  userName?: string;
}

export function MainNavbar({ userRole, userName }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#00629B] flex items-center justify-center text-white font-bold shadow-md shadow-[#00629B]/20 group-hover:scale-105 transition-transform">
              IEEE
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg block leading-tight">
                One Minute Talk
              </span>
              <span className="text-xs text-[#00629B] font-semibold tracking-wider uppercase">
                Student Branch Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {userRole ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">
                  Hi, {userName || 'User'} ({userRole})
                </span>
                <Link
                  href={userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00629B] hover:bg-[#004e7c] rounded-lg transition-colors shadow-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logoutAction()}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#00629B] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#00629B] hover:bg-[#004e7c] rounded-lg transition-colors shadow-sm shadow-[#00629B]/20"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#00629B] flex items-center justify-center text-white font-bold text-xs">
                IEEE
              </div>
              <span className="font-bold text-white text-lg">One Minute Talk Portal</span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering students to master public speaking, build confidence, and articulate impactful ideas in 60 seconds.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-[#00629B] space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Student Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">New Registration</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact IEEE Student Branch</h4>
            <p className="text-sm mb-2">Campus Engineering Hall, Room 402</p>
            <p className="text-sm mb-2">Email: ieee.omt@college.edu</p>
            <p className="text-sm">Phone: +1 (555) 019-2834</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} IEEE Student Branch. All rights reserved. Built for Monthly One Minute Talks.
        </div>
      </div>
    </footer>
  );
}
