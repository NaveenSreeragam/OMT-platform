import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

function loginUrl(request: NextRequest, message: string) {
  const url = new URL('/login', request.url);
  url.searchParams.set('error', message);
  return url;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  let response = NextResponse.redirect(new URL('/student/dashboard', request.url));
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.redirect(loginUrl(request, 'Authentication is not configured.'));
  }

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const isConfirmationType = type === 'email' || type === 'signup';
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && isConfirmationType
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error('The confirmation link is missing or invalid.') };

  if (error) {
    response = NextResponse.redirect(loginUrl(request, 'Your confirmation link is invalid or has expired.'));
  }

  return response;
}
