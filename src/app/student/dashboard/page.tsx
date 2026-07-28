import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { StudentDashboardClient } from '@/components/student/StudentDashboardClient';

export default async function StudentDashboardPage() {
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

  // Fetch currently active session
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'active')
    .maybeSingle();

  let userRegistration = null;
  if (activeSession && user) {
    const { data: reg } = await supabase
      .from('registrations')
      .select('*')
      .eq('student_id', user.id)
      .eq('session_id', activeSession.id)
      .maybeSingle();
    userRegistration = reg;
  }

  // Calculate student performance stats
  const { data: studentScores } = await supabase
    .from('scores')
    .select('total_score, registrations!inner(student_id)')
    .eq('registrations.student_id', user?.id || '');

  let bestScore = 0;
  let avgScore = 0;
  const totalSessions = studentScores?.length || 0;

  if (studentScores && studentScores.length > 0) {
    const scoresList = studentScores.map((s) => Number(s.total_score));
    bestScore = Math.max(...scoresList);
    avgScore = scoresList.reduce((a, b) => a + b, 0) / scoresList.length;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <StudentSidebar studentName={profile?.full_name} studentEmail={profile?.email} />
      
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <StudentDashboardClient
            student={profile}
            activeSession={activeSession}
            userRegistration={userRegistration}
            stats={{ bestScore, avgScore, totalSessions }}
          />
        </div>
      </main>
    </div>
  );
}
