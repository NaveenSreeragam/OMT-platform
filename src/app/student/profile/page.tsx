import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { StudentProfileClient } from '@/components/student/StudentProfileClient';

export default async function StudentProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  // Calculate profile statistics & overall highest rank across all sessions
  const { data: leaderboardData } = await supabase
    .from('session_leaderboards')
    .select('rank, total_score')
    .eq('student_id', user?.id || '');

  let totalSessions = leaderboardData?.length || 0;
  let bestScore = 0;
  let avgScore = 0;
  let highestRank: number | string = 'N/A';

  if (leaderboardData && leaderboardData.length > 0) {
    const scores = leaderboardData.map((d) => Number(d.total_score));
    bestScore = Math.max(...scores);
    avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const ranks = leaderboardData.map((d) => d.rank);
    highestRank = Math.min(...ranks);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar studentName={profile?.full_name} studentEmail={profile?.email} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <StudentProfileClient
            profile={profile}
            stats={{ totalSessions, bestScore, avgScore, highestRank }}
          />
        </div>
      </main>
    </div>
  );
}
