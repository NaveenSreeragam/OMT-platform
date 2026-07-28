'use client';

import React from 'react';
import { Download, RefreshCw, Award } from 'lucide-react';
import type { LeaderboardEntry, Session } from '@/types';

interface LeaderboardManagementProps {
  activeSession: Session | null;
  leaderboardEntries: LeaderboardEntry[];
}

export function AdminLeaderboardClient({
  activeSession,
  leaderboardEntries,
}: LeaderboardManagementProps) {
  const entries = leaderboardEntries;

  function handleExportCSV() {
    if (!entries || entries.length === 0) return;

    const headers = ['Rank', 'Registration Number', 'Student Name', 'Email', 'Department', 'Communication', 'Confidence', 'Content', 'Time Management', 'Total Score', 'Advisor Remarks'];
    const rows = entries.map((e) => [
      e.rank,
      e.registration_number,
      `"${e.student_name}"`,
      e.student_email,
      `"${e.department}"`,
      e.communication,
      e.confidence,
      e.content,
      e.time_management,
      e.total_score,
      `"${(e.advisor_remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IEEE_OMT_Leaderboard_${activeSession?.title || 'Export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Leaderboard Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeSession ? `Active Session: ${activeSession.title}` : 'No active session currently published.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Rankings</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#00629B] hover:bg-[#004e7c] text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {entries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Reg #</th>
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
                {entries.map((entry) => {
                  let rankBadge = null;
                  if (entry.rank === 1) rankBadge = <span className="text-xl">🥇</span>;
                  else if (entry.rank === 2) rankBadge = <span className="text-xl">🥈</span>;
                  else if (entry.rank === 3) rankBadge = <span className="text-xl">🥉</span>;
                  else rankBadge = <span className="font-bold text-slate-700">#{entry.rank}</span>;

                  return (
                    <tr key={entry.score_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">{rankBadge}</td>
                      <td className="py-4 px-6 font-bold text-[#00629B] text-xs">
                        {entry.registration_number}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900">{entry.student_name}</td>
                      <td className="py-4 px-6 text-slate-600 text-xs">{entry.department}</td>
                      <td className="py-4 px-6 text-center text-slate-600">{entry.communication}</td>
                      <td className="py-4 px-6 text-center text-slate-600">{entry.confidence}</td>
                      <td className="py-4 px-6 text-center text-slate-600">{entry.content}</td>
                      <td className="py-4 px-6 text-center text-slate-600">{entry.time_management}</td>
                      <td className="py-4 px-6 text-right font-extrabold text-[#00629B]">
                        {Number(entry.total_score).toFixed(1)} / 40
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No evaluations published for active session.</p>
          </div>
        )}
      </div>
    </div>
  );
}
