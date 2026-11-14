'use client';

import React, { useState } from 'react';
import { Search, Bell, Clock, Calendar, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';

export default function ReceptionHeader() {
  const { doctorLeaves, appointments } = useHospital();
  const [globalSearch, setGlobalSearch] = useState('');

  const todayStr = 'Saturday, 14 Nov 2026';
  const urgentAlerts = doctorLeaves.filter((l) => l.affected_appointments_count > l.rescheduled_count);

  return (
    <header className="bg-white border-b border-orange-100 shadow-xs px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30">
      {/* Date & Shift Context */}
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1.5 text-[#245BFF] font-semibold">
          <Calendar className="w-4 h-4 text-[#245BFF]" />
          <span>{todayStr}</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Morning OPD Shift (08:00 - 16:00)</span>
        </div>
      </div>

      {/* Operational Indicators & Global Search */}
      <div className="flex items-center space-x-4">
        {urgentAlerts.length > 0 && (
          <div className="flex items-center space-x-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{urgentAlerts.length} Doctor Leave Action Required</span>
          </div>
        )}

        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient, phone or booking..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-orange-50/50 border border-orange-200/80 rounded-lg text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#245BFF] focus:bg-white text-gray-800 transition"
          />
        </div>

        <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Ops Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
