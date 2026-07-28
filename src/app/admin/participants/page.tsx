import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminParticipantsClient } from '@/components/admin/AdminParticipantsClient';

export default async function AdminParticipantsPage() {
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar adminName={adminProfile?.full_name} adminEmail={adminProfile?.email} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AdminParticipantsClient registrations={registrations || []} />
        </div>
      </main>
    </div>
  );
}
