import React from 'react';
import { MainNavbar, Footer } from '@/components/layout/Navbar';
import Link from 'next/link';
import { Award, Calendar, MessageSquare, TrendingUp, ChevronRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userRole: 'student' | 'admin' | undefined;
  let userName: string | undefined;

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single();
    if (profile) {
      userRole = profile.role;
      userName = profile.full_name;
    }
  }

  // Fetch active session summary for landing page showcase
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('title, session_date, venue, status')
    .eq('status', 'active')
    .maybeSingle();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNavbar userRole={userRole} userName={userName} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#00629B] text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00629B] animate-pulse"></span>
              <span>IEEE Student Branch Flagship Event</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              IEEE One Minute Talk Portal
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              Improve your communication skills through monthly One Minute Talk competitions. Express ideas, build confidence, and receive personalized advisor feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href={userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#00629B] hover:bg-[#004e7c] rounded-xl shadow-lg shadow-[#00629B]/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#00629B] hover:bg-[#004e7c] rounded-xl shadow-lg shadow-[#00629B]/25 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Register Now</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-center"
                  >
                    Student Login
                  </Link>
                </>
              )}
            </div>

            {activeSession && (
              <div className="mt-12 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00629B]">Currently Active Session</span>
                  <p className="font-bold text-slate-900 text-sm">{activeSession.title}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>Venue: {activeSession.venue}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Portal Features</h2>
            <p className="mt-3 text-slate-600 max-w-xl mx-auto">Everything you need to showcase, evaluate, and track progress in monthly speech talks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#00629B] flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Monthly Sessions</h3>
              <p className="text-sm text-slate-600">Register with one click for monthly One Minute Talk events hosted by IEEE.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Live Leaderboards</h3>
              <p className="text-sm text-slate-600">Dynamic rankings automatically calculated from advisor evaluation scores.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Advisor Feedback</h3>
              <p className="text-sm text-slate-600">Constructive feedback cards covering communication, confidence, content & timing.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Performance Tracking</h3>
              <p className="text-sm text-slate-600">Track your overall progress, personal bests, and session history over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#00629B] font-bold text-sm uppercase tracking-wider">About The Initiative</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-6">Fostering Academic & Professional Excellence</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                The IEEE Student Branch One Minute Talk (OMT) platform is designed to encourage students across engineering and technical departments to articulate complex ideas clearly under a 60-second timer.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#00629B]" />
                  <span>Transparent evaluation criteria (0-10 per category)</span>
                </li>
                <li className="flex items-center space-x-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#00629B]" />
                  <span>Real-time score updates and marksheet generation</span>
                </li>
                <li className="flex items-center space-x-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#00629B]" />
                  <span>Direct feedback from IEEE faculty advisors</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-[#00629B] text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-md shadow-[#00629B]/20">
                OMT
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Speak Up?</h3>
              <p className="text-slate-600 text-sm mb-6">Join hundreds of IEEE student participants in our next session.</p>
              <Link
                href="/register"
                className="inline-block px-8 py-3.5 bg-[#00629B] text-white font-semibold rounded-xl hover:bg-[#004e7c] transition-colors shadow-sm"
              >
                Create Account & Enroll
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
