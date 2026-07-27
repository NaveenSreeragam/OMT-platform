import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Calendar, Users, UserCheck, ClipboardCheck, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  // Fetch metrics: Active Session
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'active')
    .maybeSingle();

  // Metric 2: Total Registered Students in Platform
  const { count: totalStudents } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'student');

  // Metric 3: Registered Students in Active Session
  let registeredInActive = 0;
  let completedEvaluations = 0;
  let pendingEvaluations = 0;

  if (activeSession) {
    const { count: regCount } = await supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', activeSession.id);
    registeredInActive = regCount || 0;

    const { count: evalCompleted } = await supabase
      .from('scores')
      .select('id', { count: 'exact', head: true })
      .eq('registrations.session_id', activeSession.id);
    
    completedEvaluations = evalCompleted || 0;
    pendingEvaluations = Math.max(0, registeredInActive - completedEvaluations);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar adminName={adminProfile?.full_name} adminEmail={adminProfile?.email} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="px-3 py-1 bg-[#00629B] text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                IEEE Executive Admin
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                One Minute Talk Control Panel
              </h1>
              <p className="text-slate-300 max-w-xl text-sm">
                Manage monthly competition sessions, register participants, input advisor evaluation marks, and publish live rank leaderboards.
              </p>
            </div>
          </div>

          {/* Metric Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#00629B] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <span className="text-3xl font-black text-slate-900">{totalStudents || 0}</span>
              <p className="text-xs text-slate-500 mt-1">Registered Platform Accounts</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Session Registrants</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <span className="text-3xl font-black text-slate-900">{registeredInActive}</span>
              <p className="text-xs text-slate-500 mt-1">Enrolled in current session</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Evaluations</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
              </div>
              <span className="text-3xl font-black text-slate-900">{completedEvaluations}</span>
              <p className="text-xs text-slate-500 mt-1">Scores saved & ranked</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Evaluations</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <span className="text-3xl font-black text-slate-900">{pendingEvaluations}</span>
              <p className="text-xs text-slate-500 mt-1">Awaiting advisor marks</p>
            </div>
          </div>

          {/* Current Active Session Box */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Current Active Session Overview</h2>
                <p className="text-xs text-slate-500">Only ONE session can be ACTIVE at any time.</p>
              </div>
              <Link
                href="/admin/sessions"
                className="px-4 py-2 bg-[#00629B] hover:bg-[#004e7c] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
              >
                Manage Sessions
              </Link>
            </div>

            {activeSession ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Session Title</span>
                  <span className="text-lg font-bold text-slate-900">{activeSession.title}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Venue</span>
                  <span className="text-lg font-bold text-slate-900">{activeSession.venue}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Participant Limit</span>
                  <span className="text-lg font-bold text-slate-900">{registeredInActive} / {activeSession.max_participants}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="font-semibold text-slate-700">No session is currently set as ACTIVE.</p>
                <p className="text-xs text-slate-400 mt-1">Go to Session Management to create or activate a session.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
