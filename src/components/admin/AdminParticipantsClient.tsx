'use client';

import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, UserCheck } from 'lucide-react';

interface ParticipantsClientProps {
  registrations: any[];
}

export function AdminParticipantsClient({ registrations }: ParticipantsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const filtered = registrations.filter((reg) => {
    const student = reg.profiles;
    const matchesSearch =
      student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registration_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === '' || student?.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const departments = Array.from(
    new Set(registrations.map((r) => r.profiles?.department).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Registered Participants</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and filter all student registrations across One Minute Talk sessions.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search name, email, OMT ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-[#00629B]"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Reg #</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Session Title</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((reg) => {
                  const student = reg.profiles;
                  const session = reg.sessions;
                  const score = reg.scores?.[0];

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#00629B] text-xs">
                        {reg.registration_number}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {student?.full_name || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs">{student?.email}</td>
                      <td className="py-4 px-6 text-slate-600 text-xs">{student?.department}</td>
                      <td className="py-4 px-6 text-slate-700 font-medium text-xs">
                        {session?.title || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          reg.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-[#00629B]'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                        {score ? `${Number(score.total_score).toFixed(1)}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No participants match filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
