'use client';

import React, { useState } from 'react';
import { registerForSessionAction } from '@/actions/sessions';
import { Calendar, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Profile, Registration, Session } from '@/types';

interface StudentDashboardProps {
  student: Profile | null;
  activeSession: Session | null;
  userRegistration: Registration | null;
  stats: {
    bestScore: number;
    avgScore: number;
    totalSessions: number;
  };
}

export function StudentDashboardClient({
  student,
  activeSession,
  userRegistration,
  stats,
}: StudentDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(!!userRegistration);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (!activeSession) return;
    setLoading(true);
    setError(null);

    const res = await registerForSessionAction(activeSession.id);
    if (res.error) {
      setError(res.error);
    } else {
      setIsRegistered(true);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-[#00629B] to-[#004e7c] rounded-3xl p-8 text-white shadow-xl shadow-[#00629B]/15 relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
            IEEE Student Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Welcome back, {student?.full_name || 'Student'}!
          </h1>
          <p className="text-blue-100 max-w-2xl text-sm leading-relaxed">
            Ready to master your public speaking? Participate in monthly One Minute Talk sessions, earn score cards, and track your communication growth.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-8 border-white rounded-full"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Best Score
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats.bestScore > 0 ? stats.bestScore.toFixed(1) : 'N/A'}
            </span>
            <span className="text-xs text-slate-400">/ 40.0</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Average Score
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats.avgScore > 0 ? stats.avgScore.toFixed(1) : 'N/A'}
            </span>
            <span className="text-xs text-slate-400">/ 40.0</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Sessions Participated
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {stats.totalSessions}
            </span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
        </div>
      </div>

      {/* Upcoming Active Session Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upcoming Active Session</h2>
            <p className="text-xs text-slate-500">IEEE Monthly One Minute Talk Competition</p>
          </div>
          {activeSession && (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE ACTIVE</span>
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {activeSession ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <h3 className="text-2xl font-extrabold text-slate-900">{activeSession.title}</h3>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#00629B]" />
                  <span>Date: {formatDate(activeSession.session_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#00629B]" />
                  <span>Venue: {activeSession.venue}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#00629B]" />
                  <span>Deadline: {formatDate(activeSession.registration_deadline)}</span>
                </div>
              </div>
            </div>

            <div>
              {isRegistered ? (
                <button
                  disabled
                  className="px-6 py-3.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 flex items-center space-x-2 cursor-default"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Registered ✓</span>
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="px-8 py-3.5 bg-[#00629B] hover:bg-[#004e7c] text-white font-bold rounded-xl shadow-lg shadow-[#00629B]/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register for Next Session'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold">No active session currently scheduled.</p>
            <p className="text-xs text-slate-400">Check back soon for the next IEEE monthly announcement.</p>
          </div>
        )}
      </div>
    </div>
  );
}
