'use client';

import React, { useState } from 'react';
import { updateProfileInfo } from '@/actions/scores';
import { User, Mail, Phone, Building, BookOpen, Calendar, AlertCircle, CheckCircle, Save } from 'lucide-react';

interface StudentProfileClientProps {
  profile: any;
  stats: {
    totalSessions: number;
    bestScore: number;
    avgScore: number;
    highestRank: number | string;
  };
}

export function StudentProfileClient({ profile, stats }: StudentProfileClientProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfileInfo(formData);

    if (res.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-24 h-24 rounded-full bg-[#00629B] text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-[#00629B]/20 shrink-0">
          {profile?.full_name?.charAt(0) || 'S'}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">{profile?.full_name}</h1>
          <p className="text-sm font-medium text-slate-500">{profile?.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="px-3 py-1 bg-blue-50 text-[#00629B] text-xs font-bold rounded-full border border-blue-100">
              {profile?.college || 'IEEE Branch'}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              {profile?.department || 'Department'}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              {profile?.year || 'Year'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Sessions</span>
          <span className="text-2xl font-black text-slate-900">{stats.totalSessions}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Best Score</span>
          <span className="text-2xl font-black text-[#00629B]">
            {stats.bestScore > 0 ? stats.bestScore.toFixed(1) : 'N/A'}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Score</span>
          <span className="text-2xl font-black text-slate-900">
            {stats.avgScore > 0 ? stats.avgScore.toFixed(1) : 'N/A'}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Highest Rank</span>
          <span className="text-2xl font-black text-amber-600">
            {stats.highestRank !== 'N/A' ? `#${stats.highestRank}` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Edit Profile Details</h2>
          <p className="text-xs text-slate-500">Update your contact number, department, and academic year.</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Full Name (Read-Only)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  disabled
                  value={profile?.full_name || ''}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address (Read-Only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="phone"
                  required
                  defaultValue={profile?.phone || ''}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                College / Institution (Read-Only)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  disabled
                  value={profile?.college || ''}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Department
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="department"
                  required
                  defaultValue={profile?.department || ''}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Year of Study
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  name="year"
                  required
                  defaultValue={profile?.year || '1st Year'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/20 text-sm text-slate-900 outline-none bg-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#00629B] hover:bg-[#004e7c] text-white font-bold rounded-xl shadow-lg shadow-[#00629B]/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Updates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
