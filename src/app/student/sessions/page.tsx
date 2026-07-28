import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { MySessionsClient } from '@/components/student/MySessionsClient';

export default async function StudentSessionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch logged in student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  // Load registrations and sessions first. Scores are loaded separately below
  // so session history does not depend on nested-relation cardinality.
  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      sessions (*)
    `)
    .eq('student_id', user?.id || '')
    .order('registered_at', { ascending: false });

  const registrationIds = registrations?.map((registration) => registration.id) || [];
  const { data: scores } = registrationIds.length
    ? await supabase
        .from('scores')
        .select('*')
        .in('registration_id', registrationIds)
    : { data: [] };

  const scoresByRegistration = new Map(
    (scores || []).map((score) => [score.registration_id, score])
  );
  const sessionsWithScores = (registrations || []).map((registration) => ({
    ...registration,
    scores: scoresByRegistration.has(registration.id)
      ? [scoresByRegistration.get(registration.id)]
      : [],
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar studentName={profile?.full_name} studentEmail={profile?.email} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <MySessionsClient sessions={sessionsWithScores} />
        </div>
      </main>
    </div>
  );
}
