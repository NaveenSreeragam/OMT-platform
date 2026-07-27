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

  // Fetch student's session registrations with associated session and score info
  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      sessions (*),
      scores (*)
    `)
    .eq('student_id', user?.id || '')
    .order('registered_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar studentName={profile?.full_name} studentEmail={profile?.email} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <MySessionsClient sessions={registrations || []} />
        </div>
      </main>
    </div>
  );
}
