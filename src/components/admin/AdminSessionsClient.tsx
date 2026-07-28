'use client';

import React, { useState } from 'react';
import { createSessionAction, updateSessionAction, deleteSessionAction } from '@/actions/sessions';
import { Plus, Edit2, Trash2, Calendar, MapPin, AlertCircle, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Session } from '@/types';

interface AdminSessionsClientProps {
  sessions: Session[];
}

export function AdminSessionsClient({ sessions }: AdminSessionsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function openCreateModal() {
    setEditingSession(null);
    setError(null);
    setIsModalOpen(true);
  }

  function openEditModal(session: Session) {
    setEditingSession(session);
    setError(null);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    let res;
    if (editingSession) {
      res = await updateSessionAction(editingSession.id, formData);
    } else {
      res = await createSessionAction(formData);
    }

    if (res?.error) {
      setError(res.error);
    } else {
      setIsModalOpen(false);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this session?')) return;
    await deleteSessionAction(id);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Session Management</h1>
          <p className="text-xs text-slate-500 mt-1">Create, edit, archive, and manage monthly One Minute Talk competitions.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-[#00629B] hover:bg-[#004e7c] text-white font-bold rounded-xl shadow-lg shadow-[#00629B]/20 transition-all flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => {
          const isLiveActive = session.status === 'active';
          return (
            <div
              key={session.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between space-y-4 ${
                isLiveActive ? 'border-[#00629B] ring-2 ring-[#00629B]/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    session.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : session.status === 'upcoming'
                      ? 'bg-blue-50 text-[#00629B] border border-blue-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {session.status}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(session)}
                      className="p-2 text-slate-500 hover:text-[#00629B] hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Session"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{session.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#00629B]" />
                    <span>Date: {formatDate(session.session_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#00629B]" />
                    <span>Venue: {session.venue}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Deadline: {formatDate(session.registration_deadline)}</span>
                <span className="font-semibold text-slate-700">Limit: {session.max_participants}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSession ? 'Edit Session' : 'Create New Session'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingSession?.title || ''}
                  placeholder="July 2026 IEEE One Minute Talk"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#00629B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="sessionDate"
                    required
                    defaultValue={editingSession ? new Date(editingSession.session_date).toISOString().slice(0, 16) : ''}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#00629B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="registrationDeadline"
                    required
                    defaultValue={editingSession ? new Date(editingSession.registration_deadline).toISOString().slice(0, 16) : ''}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#00629B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Venue Location
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  defaultValue={editingSession?.venue || ''}
                  placeholder="Auditorium 201 / Online MS Teams"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#00629B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    required
                    defaultValue={editingSession?.max_participants || 100}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#00629B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Session Status
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={editingSession?.status || 'upcoming'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#00629B] bg-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active (Only 1 allowed)</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#00629B] hover:bg-[#004e7c] text-white font-bold rounded-xl text-sm shadow-md"
                >
                  {loading ? 'Saving...' : 'Save Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
