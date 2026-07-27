'use client';

import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Calendar, Award, MessageSquare, X, ChevronRight } from 'lucide-react';

interface MySessionsClientProps {
  sessions: any[];
}

export function MySessionsClient({ sessions }: MySessionsClientProps) {
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">My Sessions History</h1>
        <p className="text-xs text-slate-500 mt-1">
          View all previous IEEE One Minute Talk sessions you attended along with detailed advisor feedback.
        </p>
      </div>

      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((item) => {
            const session = item.sessions;
            const score = item.scores?.[0];

            return (
              <div
                key={item.id}
                onClick={() => setSelectedSession(item)}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-[#00629B] text-xs font-bold rounded-full">
                      {item.registration_number}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                      item.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00629B] transition-colors mb-2">
                    {session?.title || 'One Minute Talk Session'}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
                    <Calendar className="w-4 h-4 text-[#00629B]" />
                    <span>{formatDate(session?.session_date)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Score</span>
                    <span className="text-lg font-extrabold text-[#00629B]">
                      {score ? `${Number(score.total_score).toFixed(1)} / 40` : 'Pending'}
                    </span>
                  </div>

                  <button className="p-2 bg-slate-50 text-slate-600 group-hover:bg-[#00629B] group-hover:text-white rounded-xl transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Session History</h3>
          <p className="text-xs text-slate-500 mt-1">
            You haven't participated in any completed One Minute Talk sessions yet.
          </p>
        </div>
      )}

      {/* Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#00629B] uppercase tracking-wider">
                  Session Details & Scorecard
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedSession.sessions?.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Criteria Breakdown */}
            {selectedSession.scores?.[0] ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 block">Communication</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {selectedSession.scores[0].communication} / 10
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 block">Confidence</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {selectedSession.scores[0].confidence} / 10
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 block">Content</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {selectedSession.scores[0].content} / 10
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 block">Time Management</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {selectedSession.scores[0].time_management} / 10
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Overall Score</span>
                  <span className="text-2xl font-black text-[#00629B]">
                    {Number(selectedSession.scores[0].total_score).toFixed(1)} / 40.0
                  </span>
                </div>

                {/* Advisor Remarks Card */}
                <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/60 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>Advisor Remarks & Feedback</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{selectedSession.scores[0].advisor_remarks || 'No specific advisor remarks provided.'}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <p>Score details pending advisor review for this session.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
