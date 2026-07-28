import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminSessionsClient } from '@/components/admin/AdminSessionsClient';

export default async function AdminSessionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single();

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <AdminSidebar adminName={adminProfile?.full_name} adminEmail={adminProfile?.email} />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AdminSessionsClient sessions={sessions || []} />
        </div>
      </main>
    </div>
  );
}
