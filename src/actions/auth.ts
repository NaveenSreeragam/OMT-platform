'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  college: z.string().min(2, 'College is required'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().min(1, 'Year of study is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto') || (host?.startsWith('localhost') ? 'http' : 'https');

  return host ? `${protocol}://${host}` : 'http://localhost:3000';
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch role to redirect to proper dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profile?.role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/student/dashboard');
  }
}

export async function registerAction(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const college = formData.get('college') as string;
  const department = formData.get('department') as string;
  const year = formData.get('year') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const validation = registerSchema.safeParse({
    fullName,
    email,
    phone,
    college,
    department,
    year,
    password,
    confirmPassword,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        college,
        department,
        year,
        role: 'student',
      },
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (authError) {
    return {
      error:
        authError.message?.trim() ||
        'Unable to create the account. Please try again or check your Supabase Auth settings.',
    };
  }

  if (!authData.user) {
    return { error: 'Supabase did not create an account. Please try again.' };
  }

  // When email confirmation is enabled, Supabase creates the account but does
  // not create a browser session until the user verifies their email address.
  if (!authData.session) {
    return {
      success:
        'Account created. Check your email to verify your account and you will be signed in automatically.',
    };
  }

  // Automatically enroll student into currently active session if one exists and deadline hasn't passed
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('id, registration_deadline, max_participants')
    .eq('status', 'active')
    .maybeSingle();

  if (activeSession) {
    const deadlinePassed = new Date(activeSession.registration_deadline) < new Date();
    if (!deadlinePassed) {
      // Count active registrations
      const { count } = await supabase
        .from('registrations')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', activeSession.id);

      if ((count || 0) < activeSession.max_participants) {
        await supabase.from('registrations').insert({
          student_id: authData.user.id,
          session_id: activeSession.id,
          status: 'registered',
        });
      }
    }
  }

  redirect('/student/dashboard');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
