'use client';

import React, { useState } from 'react';
import { saveScoreAction } from '@/actions/scores';
import { ClipboardEdit, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Profile, Registration, Score, Session } from '@/types';

type RegistrationWithDetails = Registration & {
  profiles?: Profile | null;
  sessions?: Session | null;
  scores?: Score[];
};

interface ScoreEntryClientProps {
  registrations: RegistrationWithDetails[];
}

export function AdminScoreEntryClient({ registrations }: ScoreEntryClientProps) {
  const [selectedRegId, setSelectedRegId] = useState<string>(registrations[0]?.id || '');
  const [comm, setComm] = useState<number>(8.0);
  const [conf, setConf] = useState<number>(8.0);
  const [cont, setCont] = useState<number>(8.0);
  const [time, setTime] = useState<number>(8.0);
  const [remarks, setRemarks] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedRegistration = registrations.find((r) => r.id === selectedRegId);

  // Auto-calculate total score
  const totalScore = (comm + conf + cont + time).toFixed(1);

  // Handle participant change to load existing score if present
  function handleSelectParticipant(id: string) {
    setSelectedRegId(id);
    setMessage(null);
    const reg = registrations.find((r) => r.id === id);
    const existingScore = reg?.scores?.[0];
    if (existingScore) {
      setComm(Number(existingScore.communication));
      setConf(Number(existingScore.confidence));
      setCont(Number(existingScore.content));
      setTime(Number(existingScore.time_management));
      setRemarks(existingScore.advisor_remarks || '');
    } else {
      setComm(8.0);
      setConf(8.0);
      setCont(8.0);
      setTime(8.0);
      setRemarks('');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedRegId) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('registrationId', selectedRegId);
    formData.append('communication', comm.toString());
    formData.append('confidence', conf.toString());
    formData.append('content', cont.toString());
    formData.append('timeManagement', time.toString());
    formData.append('advisorRemarks', remarks);

    const res = await saveScoreAction(formData);

    if (res.error) {
      setMessage({ type: 'error', text: res.error });
    } else {
      setMessage({ type: 'success', text: 'Score evaluation saved! Leaderboard and student scorecard updated automatically.' });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">Score Entry & Evaluation</h1>
        <p className="text-xs text-slate-500 mt-1">
          Evaluate student One Minute Talks across 4 criteria categories (0-10 each).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Participant Selection Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Select Participant
          </h2>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {registrations.map((reg) => {
              const isSelected = reg.id === selectedRegId;
              const hasScore = (reg.scores?.length ?? 0) > 0;

              return (
                <button
                  key={reg.id}
                  onClick={() => handleSelectParticipant(reg.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#00629B] text-white border-[#00629B] shadow-md shadow-[#00629B]/20'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{reg.profiles?.full_name}</p>
                    <p className={`text-xs truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {reg.registration_number} • {reg.profiles?.department}
                    </p>
                  </div>
                  {hasScore && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-[#00629B]' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      GRADED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {selectedRegistration ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#00629B] uppercase tracking-wider">Evaluating Student</span>
                  <h2 className="text-xl font-bold text-slate-900">{selectedRegistration.profiles?.full_name}</h2>
                  <p className="text-xs text-slate-500">
                    Session: {selectedRegistration.sessions?.title} ({selectedRegistration.registration_number})
                  </p>
                </div>
                <div className="bg-blue-50 px-4 py-3 rounded-2xl border border-blue-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Computed Total</span>
                  <span className="text-2xl font-black text-[#00629B]">{totalScore} / 40.0</span>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm flex items-center space-x-2 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Category 1 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-slate-700">Communication</label>
                      <span className="text-sm font-extrabold text-[#00629B]">{comm} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={comm}
                      onChange={(e) => setComm(parseFloat(e.target.value))}
                      className="w-full accent-[#00629B]"
                    />
                  </div>

                  {/* Category 2 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-slate-700">Confidence</label>
                      <span className="text-sm font-extrabold text-[#00629B]">{conf} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={conf}
                      onChange={(e) => setConf(parseFloat(e.target.value))}
                      className="w-full accent-[#00629B]"
                    />
                  </div>

                  {/* Category 3 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-slate-700">Content</label>
                      <span className="text-sm font-extrabold text-[#00629B]">{cont} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={cont}
                      onChange={(e) => setCont(parseFloat(e.target.value))}
                      className="w-full accent-[#00629B]"
                    />
                  </div>

                  {/* Category 4 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-slate-700">Time Management</label>
                      <span className="text-sm font-extrabold text-[#00629B]">{time} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={time}
                      onChange={(e) => setTime(parseFloat(e.target.value))}
                      className="w-full accent-[#00629B]"
                    />
                  </div>
                </div>

                {/* Advisor Remarks */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                    Advisor Remarks & Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Provide constructive feedback on body language, vocal modulation, and content structure..."
                    className="w-full p-4 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#00629B] focus:ring-2 focus:ring-[#00629B]/10"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-[#00629B] hover:bg-[#004e7c] text-white font-bold rounded-xl shadow-lg shadow-[#00629B]/20 transition-all flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving Score...' : 'Save Evaluation Score'}</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400">
              <ClipboardEdit className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No participant selected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
