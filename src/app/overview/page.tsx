'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  UserX,
  UserCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Phone,
  User,
  Activity,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';

export default function ReceptionOverviewPage() {
  const {
    appointments,
    doctors,
    doctorLeaves,
    payments,
    updateAppointmentStatus,
    updatePaymentStatus,
  } = useHospital();

  const [filterDept, setFilterDept] = useState<string>('all');

  // Compute Operations Metrics for Today
  const todayApts = appointments.filter((a) => a.appointment_date === '2026-11-14');
  const confirmedCount = todayApts.filter((a) => a.appointment_status === 'Confirmed').length;
  const pendingCount = todayApts.filter((a) => a.appointment_status === 'Pending').length;
  const arrivedCount = todayApts.filter(
    (a) => a.appointment_status === 'Checked In' || a.appointment_status === 'In Consultation'
  ).length;
  const completedCount = todayApts.filter((a) => a.appointment_status === 'Completed').length;

  const availableDocs = doctors.filter((d) => d.is_available_today).length;
  const absentDocs = doctors.filter((d) => !d.is_available_today).length;

  const todayRevenue = payments
    .filter((p) => p.payment_date.startsWith('2026-11-14') && p.payment_status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentsCount = todayApts.filter((a) => a.payment_status === 'Pending').length;

  // Emergency Leave alerts needing action
  const urgentLeaves = doctorLeaves.filter(
    (l) => l.affected_appointments_count > l.rescheduled_count
  );

  return (
    <div className="space-y-6">
      {/* Title & Fast Operational Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#245BFF] tracking-tight">
            Hospital Operations Overview
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time morning OPD session, doctor presence, and patient queue control.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Link
            href="/appointments"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#245BFF] hover:bg-[#1A45C8] text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book New Appointment</span>
          </Link>
          <Link
            href="/patients"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-orange-200 text-[#245BFF] hover:bg-orange-50 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Register Patient</span>
          </Link>
        </div>
      </div>

      {/* Actionable Urgent Alerts Banner */}
      {urgentLeaves.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-sm font-bold text-amber-900">
                  Doctor Schedule Alert: {urgentLeaves[0].doctor_name} Marked Absent Today
                </h2>
                <p className="text-xs text-amber-800 mt-0.5">
                  Reason: {urgentLeaves[0].reason}. <strong>{urgentLeaves[0].affected_appointments_count} patients</strong> have bookings with this doctor today and need rescheduling.
                </p>
              </div>
            </div>
            <Link
              href="/doctors"
              className="text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition ml-4 flex-shrink-0"
            >
              <span>Reschedule Impacted Patients</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Today&apos;s Appointments</span>
            <CalendarCheck className="w-4 h-4 text-[#245BFF]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">{todayApts.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">{confirmedCount} confirmed</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            {pendingCount} awaiting reception verification
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Patient Check-in / Queue</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-700">{arrivedCount}</span>
            <span className="text-xs text-gray-500">arrived in lobby</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            {completedCount} consultations concluded
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Doctor Availability</span>
            <UserCheck className="w-4 h-4 text-[#245BFF]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#245BFF]">{availableDocs} / {doctors.length}</span>
            <span className="text-xs text-gray-500">on duty</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 font-medium">
            {absentDocs > 0 ? `${absentDocs} doctor on emergency absence` : 'All doctors present'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>OPD Collection (Today)</span>
            <CreditCard className="w-4 h-4 text-[#245BFF]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#245BFF]">₹{todayRevenue}</span>
            <span className="text-xs text-gray-500">collected</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-medium">
            {pendingPaymentsCount} pending fee collection
          </div>
        </div>
      </div>

      {/* Main Operations Split: Live Appointment Timeline & Quick Doctors Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Chronological Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
            <div>
              <h2 className="text-base font-bold text-[#245BFF]">Today&apos;s Appointment Schedule</h2>
              <p className="text-xs text-gray-500">Chronological patient queue & reception controls</p>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-semibold text-[#245BFF] hover:text-[#245BFF] flex items-center space-x-1"
            >
              <span>View Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {todayApts.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No appointments scheduled for today yet.
              </div>
            ) : (
              todayApts.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 hover:bg-orange-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-16 flex-shrink-0 text-center bg-orange-50 border border-orange-200/60 rounded-lg p-1.5">
                      <span className="block text-xs font-bold text-[#245BFF]">{apt.time_slot}</span>
                      <span className="text-[10px] text-[#EA580C] uppercase font-medium">{apt.booking_ref}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-gray-900">{apt.patient_name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            apt.appointment_status === 'Checked In'
                              ? 'bg-orange-100 text-[#EA580C] border border-orange-200'
                              : apt.appointment_status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : apt.appointment_status === 'Rescheduled'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {apt.appointment_status}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-medium text-[#245BFF]">{apt.doctor_name}</span>
                        <span className="text-gray-300">•</span>
                        <span>{apt.department_name}</span>
                        <span className="text-gray-300">•</span>
                        <a
                          href={`tel:${apt.patient_phone}`}
                          className="text-[#245BFF] hover:underline flex items-center space-x-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{apt.patient_phone}</span>
                        </a>
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-gray-400 mt-1 italic line-clamp-1">
                          Note: {apt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Reception Action Buttons */}
                  <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                    {apt.appointment_status !== 'Checked In' && apt.appointment_status !== 'Completed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center space-x-1 transition shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Check In</span>
                      </button>
                    )}

                    {apt.payment_status === 'Pending' ? (
                      <button
                        onClick={() => updatePaymentStatus(apt.id, 'Paid', 'Cash')}
                        className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#245BFF] border border-orange-200 rounded-md text-xs font-semibold flex items-center space-x-1 transition"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-[#245BFF]" />
                        <span>Collect ₹{apt.consultation_fee}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Paid ({apt.payment_method || 'Cash'})
                      </span>
                    )}

                    <Link
                      href="/appointments"
                      className="p-1.5 text-gray-400 hover:text-[#245BFF] hover:bg-orange-50 rounded"
                      title="Manage details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Doctors Duty Board & Quick Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/40">
              <h2 className="text-sm font-bold text-[#245BFF]">Doctor OPD Duty Board</h2>
              <Link href="/doctors" className="text-xs text-[#245BFF] font-semibold hover:underline">
                Manage
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {doctors.map((doc) => (
                <div key={doc.id} className="p-3.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{doc.name}</h3>
                    <p className="text-[11px] text-gray-500">{doc.department_name}</p>
                    <p className="text-[10px] text-[#245BFF] font-medium">{doc.opd_timings}</p>
                  </div>
                  <div>
                    {doc.is_available_today ? (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold">
                        Available
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-semibold">
                        On Leave
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hospital Contacts Card */}
          <div className="bg-gradient-to-br from-[#240b3b] to-[#170526] text-white p-4 rounded-xl shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Reception Key Extensions
            </h3>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-purple-800/60">
                <span className="text-purple-200">24x7 Ambulance Dispatch</span>
                <span className="font-bold text-white">+91 9839752108</span>
              </div>
              <div className="flex justify-between items-center pb-1.5 border-b border-purple-800/60">
                <span className="text-purple-200">ICU & Emergency Ward</span>
                <span className="font-bold text-white">+91 9161103325</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Pathology & Radiology Lab</span>
                <span className="font-bold text-white">+91 7897576583</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
