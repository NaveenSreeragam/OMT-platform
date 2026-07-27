import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Trophy, Medal, Award, UserCheck } from 'lucide-react';

export default async function StudentLeaderboardPage() {
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

  // Fetch active session
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'active')
    .maybeSingle();

  let leaderboardEntries: any[] = [];

  if (activeSession) {
    const { data: entries } = await supabase
      .from('session_leaderboards')
      .select('*')
      .eq('session_id', activeSession.id)
      .order('rank', { ascending: true });

    leaderboardEntries = entries || [];
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar studentName={profile?.full_name} studentEmail={profile?.email} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#00629B] font-bold text-xs uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4" />
                <span>Live Rankings</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Active Session Leaderboard</h1>
              <p className="text-xs text-slate-500 mt-1">
                {activeSession ? `Session: ${activeSession.title}` : 'No active session currently published.'}
              </p>
            </div>

            {activeSession && (
              <span className="px-4 py-2 bg-blue-50 text-[#00629B] text-xs font-bold rounded-xl border border-blue-100">
                Total Participants Evaluated: {leaderboardEntries.length}
              </span>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {leaderboardEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Rank</th>
                      <th className="py-4 px-6">Student Name</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6 text-center">Comm</th>
                      <th className="py-4 px-6 text-center">Conf</th>
                      <th className="py-4 px-6 text-center">Cont</th>
                      <th className="py-4 px-6 text-center">Time</th>
                      <th className="py-4 px-6 text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {leaderboardEntries.map((entry) => {
                      const isCurrentUser = entry.student_id === user?.id;

                      let rankBadge = null;
                      if (entry.rank === 1) rankBadge = <span className="text-2xl" title="1st Place">🥇</span>;
                      else if (entry.rank === 2) rankBadge = <span className="text-2xl" title="2nd Place">🥈</span>;
                      else if (entry.rank === 3) rankBadge = <span className="text-2xl" title="3rd Place">🥉</span>;
                      else rankBadge = <span className="font-bold text-slate-700 text-base">#{entry.rank}</span>;

                      return (
                        <tr
                          key={entry.score_id}
                          className={`transition-colors ${
                            isCurrentUser
                              ? 'bg-blue-50/70 font-semibold border-l-4 border-l-[#00629B]'
                              : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              {rankBadge}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-900">
                            <div className="flex items-center space-x-2">
                              <span>{entry.student_name}</span>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 bg-[#00629B] text-white text-[10px] font-bold rounded-full">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600">{entry.department}</td>
                          <td className="py-4 px-6 text-center text-slate-600">{entry.communication}</td>
                          <td className="py-4 px-6 text-center text-slate-600">{entry.confidence}</td>
                          <td className="py-4 px-6 text-center text-slate-600">{entry.content}</td>
                          <td className="py-4 px-6 text-center text-slate-600">{entry.time_management}</td>
                          <td className="py-4 px-6 text-right font-extrabold text-[#00629B] text-base">
                            {Number(entry.total_score).toFixed(1)} / 40
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 px-4 text-slate-500">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-lg">No Leaderboard Data</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluations for the active session are still in progress or no scores have been published yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
