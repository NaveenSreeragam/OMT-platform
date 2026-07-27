import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminScoreEntryClient } from '@/components/admin/AdminScoreEntryClient';

export default async function AdminScoresPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      profiles (*),
      sessions (*),
      scores (*)
    `)
    .order('registered_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar adminName={adminProfile?.full_name} adminEmail={adminProfile?.email} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AdminScoreEntryClient registrations={registrations || []} />
        </div>
      </main>
    </div>
  );
}
