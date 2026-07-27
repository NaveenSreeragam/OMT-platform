'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { registerAction } from '@/actions/auth';
import { MainNavbar } from '@/components/layout/Navbar';
import { User, Mail, Phone, Building, BookOpen, Calendar, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <MainNavbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#00629B] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-md shadow-[#00629B]/20">
              IEEE
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Student Registration</h1>
            <p className="text-sm text-slate-500 mt-1">
              Create your profile to automatically enroll in the active monthly One Minute Talk session.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@college.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="+1 555-0192"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  College / Institution
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="college"
                    required
                    defaultValue="IEEE Student Branch College"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="Computer Science & Eng"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Year of Study
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    name="year"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none bg-white"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00629B] hover:bg-[#004e7c] text-white font-bold rounded-xl shadow-lg shadow-[#00629B]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account & Enrolling...' : 'Register Account'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already registered?{' '}
              <Link href="/login" className="font-bold text-[#00629B] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
