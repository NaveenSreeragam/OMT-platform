import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminLeaderboardClient } from '@/components/admin/AdminLeaderboardClient';
import type { LeaderboardEntry } from '@/types';

export default async function AdminLeaderboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  const { data: activeSession } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'active')
    .maybeSingle();

  let leaderboardEntries: LeaderboardEntry[] = [];

  if (activeSession) {
    const { data: entries } = await supabase
      .from('session_leaderboards')
      .select('*')
      .eq('session_id', activeSession.id)
      .order('rank', { ascending: true });

    leaderboardEntries = entries || [];
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar adminName={adminProfile?.full_name} adminEmail={adminProfile?.email} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AdminLeaderboardClient
            activeSession={activeSession}
            leaderboardEntries={leaderboardEntries}
          />
        </div>
      </main>
    </div>
  );
}
