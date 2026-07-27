'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const scoreSchema = z.object({
  registrationId: z.string().uuid(),
  communication: z.number().min(0).max(10),
  confidence: z.number().min(0).max(10),
  content: z.number().min(0).max(10),
  timeManagement: z.number().min(0).max(10),
  advisorRemarks: z.string().optional(),
});

export async function saveScoreAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const registrationId = formData.get('registrationId') as string;
  const communication = parseFloat(formData.get('communication') as string || '0');
  const confidence = parseFloat(formData.get('confidence') as string || '0');
  const content = parseFloat(formData.get('content') as string || '0');
  const timeManagement = parseFloat(formData.get('timeManagement') as string || '0');
  const advisorRemarks = (formData.get('advisorRemarks') as string) || '';

  const validation = scoreSchema.safeParse({
    registrationId,
    communication,
    confidence,
    content,
    timeManagement,
    advisorRemarks,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // Check if score already exists for this registration
  const { data: existingScore } = await supabase
    .from('scores')
    .select('id')
    .eq('registration_id', registrationId)
    .maybeSingle();

  if (existingScore) {
    // Update existing score
    const { error } = await supabase
      .from('scores')
      .update({
        communication,
        confidence,
        content,
        time_management: timeManagement,
        advisor_remarks: advisorRemarks,
        updated_by: user.id,
      })
      .eq('id', existingScore.id);

    if (error) return { error: error.message };
  } else {
    // Insert new score
    const { error } = await supabase.from('scores').insert({
      registration_id: registrationId,
      communication,
      confidence,
      content,
      time_management: timeManagement,
      advisor_remarks: advisorRemarks,
      evaluated_by: user.id,
      updated_by: user.id,
    });

    if (error) return { error: error.message };

    // Update registration status to completed
    await supabase
      .from('registrations')
      .update({ status: 'completed' })
      .eq('id', registrationId);
  }

  revalidatePath('/admin/scores');
  revalidatePath('/admin/leaderboard');
  revalidatePath('/student/leaderboard');
  revalidatePath('/student/sessions');
  revalidatePath('/student/dashboard');

  return { success: true };
}

export async function updateProfileInfo(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const phone = formData.get('phone') as string;
  const department = formData.get('department') as string;
  const year = formData.get('year') as string;

  const { error } = await supabase
    .from('profiles')
    .update({
      phone,
      department,
      year,
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/student/profile');
  return { success: true };
}
