'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const sessionSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  sessionDate: z.string().min(1, 'Session date is required'),
  venue: z.string().min(2, 'Venue is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  maxParticipants: z.number().min(1, 'Max participants must be at least 1'),
  status: z.enum(['upcoming', 'active', 'completed', 'archived']),
});

export async function createSessionAction(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  const sessionDate = formData.get('sessionDate') as string;
  const venue = formData.get('venue') as string;
  const registrationDeadline = formData.get('registrationDeadline') as string;
  const maxParticipants = parseInt(formData.get('maxParticipants') as string || '100', 10);
  const status = formData.get('status');

  const validation = sessionSchema.safeParse({
    title,
    sessionDate,
    venue,
    registrationDeadline,
    maxParticipants,
    status,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }
  const validatedStatus = validation.data.status;

  // If status is active, check if another session is already active
  if (validatedStatus === 'active') {
    const { data: existingActive } = await supabase
      .from('sessions')
      .select('id')
      .eq('status', 'active')
      .maybeSingle();

    if (existingActive) {
      return { error: 'There can only be ONE active session at a time. Please archive or complete the active session first.' };
    }
  }

  const { error } = await supabase.from('sessions').insert({
    title,
    session_date: new Date(sessionDate).toISOString(),
    venue,
    registration_deadline: new Date(registrationDeadline).toISOString(),
    max_participants: maxParticipants,
    status: validatedStatus,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/sessions');
  revalidatePath('/student/dashboard');
  return { success: true };
}

export async function updateSessionAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get('title') as string;
  const sessionDate = formData.get('sessionDate') as string;
  const venue = formData.get('venue') as string;
  const registrationDeadline = formData.get('registrationDeadline') as string;
  const maxParticipants = parseInt(formData.get('maxParticipants') as string || '100', 10);
  const status = formData.get('status');

  const validation = sessionSchema.safeParse({
    title,
    sessionDate,
    venue,
    registrationDeadline,
    maxParticipants,
    status,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }
  const validatedStatus = validation.data.status;

  // If setting status to active, verify no other active sessions exist
  if (validatedStatus === 'active') {
    const { data: existingActive } = await supabase
      .from('sessions')
      .select('id')
      .eq('status', 'active')
      .neq('id', id)
      .maybeSingle();

    if (existingActive) {
      return { error: 'Another session is already Active. Set it to Completed/Archived before activating this session.' };
    }
  }

  const { error } = await supabase
    .from('sessions')
    .update({
      title,
      session_date: new Date(sessionDate).toISOString(),
      venue,
      registration_deadline: new Date(registrationDeadline).toISOString(),
      max_participants: maxParticipants,
      status: validatedStatus,
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/sessions');
  revalidatePath('/student/dashboard');
  return { success: true };
}

export async function deleteSessionAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('sessions').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/sessions');
  return { success: true };
}

export async function registerForSessionAction(sessionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Must be logged in to register' };
  }

  // Fetch session details
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (!session) {
    return { error: 'Session not found' };
  }

  if (new Date(session.registration_deadline) < new Date()) {
    return { error: 'Registration deadline has passed for this session.' };
  }

  // Check current participant count
  const { count } = await supabase
    .from('registrations')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId);

  if ((count || 0) >= session.max_participants) {
    return { error: 'Session participant limit reached.' };
  }

  const { error } = await supabase.from('registrations').insert({
    student_id: user.id,
    session_id: sessionId,
    status: 'registered',
  });

  if (error) {
    if (error.code === '23505') {
      return { error: 'You are already registered for this session.' };
    }
    return { error: error.message };
  }

  revalidatePath('/student/dashboard');
  revalidatePath('/admin/participants');
  return { success: true };
}
