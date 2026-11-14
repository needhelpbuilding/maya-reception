'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';

export default function DoctorsPage() {
  const {
    doctors,
    doctorLeaves,
    appointments,
    recordDoctorAbsence,
    rescheduleAppointment,
  } = useHospital();

  const [searchDoc, setSearchDoc] = useState('');
  const [selectedDoctorForAbsence, setSelectedDoctorForAbsence] = useState<string>('');
  const [absenceReason, setAbsenceReason] = useState('Medical emergency leave');
  const [absenceType, setAbsenceType] = useState<'emergency' | 'sick' | 'planned'>('emergency');
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);

  // Active Impacted Appointment Resolution Modal
  const [selectedImpactedLeave, setSelectedImpactedLeave] = useState<any | null>(null);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchDoc.toLowerCase()) ||
      d.department_name.toLowerCase().includes(searchDoc.toLowerCase())
  );

  const handleMarkAbsenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForAbsence) return;
    recordDoctorAbsence(selectedDoctorForAbsence, absenceReason, absenceType);
    setShowAbsenceModal(false);
    setSelectedDoctorForAbsence('');
  };

  // Find appointments impacted by an active leave
  const getImpactedAppointments = (doctorId: string) => {
    return appointments.filter(
      (a) =>
        a.doctor_id === doctorId &&
        a.appointment_date === '2026-11-14' &&
        a.appointment_status !== 'Cancelled' &&
        a.appointment_status !== 'Rescheduled'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#245BFF] tracking-tight">
            Doctor Availability & OPD Rostering
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor doctor duty status, log emergency absence, and safeguard patient appointments.
          </p>
        </div>
        <button
          onClick={() => setShowAbsenceModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <UserX className="w-3.5 h-3.5" />
          <span>Mark Doctor Emergency Absence</span>
        </button>
      </div>

      {/* Active Leave Alerts & Affected Patient Reassignment Banner */}
      {doctorLeaves.length > 0 && (
        <div className="bg-white rounded-xl border border-rose-200 shadow-xs overflow-hidden">
          <div className="bg-rose-50/70 p-4 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Active Leave Records & Patient Impact</span>
            </div>
            <span className="text-xs text-rose-700 font-medium">
              Immediate Patient Notification Protocol Active
            </span>
          </div>

          <div className="p-4 divide-y divide-gray-100">
            {doctorLeaves.map((leave) => {
              const impacted = getImpactedAppointments(leave.doctor_id);
              return (
                <div key={leave.id} className="py-3 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-gray-900">{leave.doctor_name}</span>
                      <span className="text-xs text-gray-500 font-medium">({leave.department_name})</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold uppercase">
                        {leave.leave_type} Leave
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Reason: {leave.reason} • Active: {leave.start_date} to {leave.end_date}
                    </p>
                    <div className="mt-1 text-xs font-semibold text-rose-700">
                      {impacted.length} patients currently scheduled today needing reassignment.
                    </div>
                  </div>

                  {impacted.length > 0 && (
                    <button
                      onClick={() => setSelectedImpactedLeave(leave)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition shadow-xs flex-shrink-0"
                    >
                      Resolve {impacted.length} Impacted Bookings
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Doctor Directory Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Filter doctors by name or department..."
          value={searchDoc}
          onChange={(e) => setSearchDoc(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-orange-200 rounded-lg text-xs focus:ring-2 focus:ring-[#245BFF] text-gray-800 transition"
        />
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const docApts = appointments.filter(
            (a) => a.doctor_id === doc.id && a.appointment_date === '2026-11-14'
          );

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition flex flex-col justify-between ${
                doc.is_available_today
                  ? 'border-slate-200 hover:border-blue-300'
                  : 'border-rose-200 bg-rose-50/20'
              }`}
            >
              <div>
                {/* Doctor Head Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 overflow-hidden flex-shrink-0 border border-orange-200">
                      <Image
                        src={doc.image || '/hospital-assets/doctors/dr-sk-sharma.png'}
                        alt={doc.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">{doc.name}</h2>
                      <p className="text-[11px] text-[#245BFF] font-semibold">{doc.degrees}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{doc.department_name}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      doc.is_available_today
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {doc.is_available_today ? 'Available' : 'Absent Today'}
                  </span>
                </div>

                {/* Duty Details */}
                <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>OPD Timings:</span>
                    </span>
                    <span className="font-semibold text-gray-900">{doc.opd_timings}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Consultation Fee:</span>
                    <span className="font-bold text-[#245BFF]">₹{doc.consultation_fee}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Today&apos;s Bookings:</span>
                    <span className="font-bold text-gray-900">{docApts.length} Patients</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Contact */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                {doc.phone && (
                  <a
                    href={`tel:${doc.phone}`}
                    className="text-[#245BFF] hover:underline flex items-center space-x-1 font-medium"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{doc.phone}</span>
                  </a>
                )}
                <span className="text-[11px] text-gray-400 font-medium">Exp: {doc.experience}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Absence Modal */}
      {showAbsenceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleMarkAbsenceSubmit}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-rose-100 space-y-4"
          >
            <div className="flex items-center space-x-2 text-rose-800">
              <UserX className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold">Mark Doctor Absence & Notify</h3>
            </div>
            <p className="text-xs text-gray-500">
              Logging an absence will immediately update the doctor&apos;s schedule and surface all affected patients for rapid rescheduling.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Doctor</label>
                <select
                  required
                  value={selectedDoctorForAbsence}
                  onChange={(e) => setSelectedDoctorForAbsence(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Leave Category</label>
                <select
                  value={absenceType}
                  onChange={(e) => setAbsenceType(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                >
                  <option value="emergency">Emergency</option>
                  <option value="sick">Sick Leave</option>
                  <option value="planned">Planned Conference / Travel</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Absence Reason</label>
                <input
                  type="text"
                  required
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAbsenceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Log Absence & Trigger Alerts
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Impacted Patients Resolution Drawer/Modal */}
      {selectedImpactedLeave && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[#245BFF]">
                  Reschedule Impacted Patients ({selectedImpactedLeave.doctor_name})
                </h3>
                <p className="text-xs text-gray-500">
                  Doctor is marked absent. Reassign each patient to an available doctor or new slot.
                </p>
              </div>
              <button
                onClick={() => setSelectedImpactedLeave(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {getImpactedAppointments(selectedImpactedLeave.doctor_id).length === 0 ? (
                <div className="p-6 text-center text-xs text-emerald-700 bg-emerald-50 rounded-lg font-medium">
                  All affected appointments have been successfully resolved or rescheduled!
                </div>
              ) : (
                getImpactedAppointments(selectedImpactedLeave.doctor_id).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 border border-amber-200 rounded-lg bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-gray-900">{apt.patient_name}</div>
                      <div className="text-gray-600 flex items-center space-x-2 mt-0.5">
                        <Phone className="w-3 h-3 text-[#245BFF]" />
                        <a href={`tel:${apt.patient_phone}`} className="hover:underline">
                          {apt.patient_phone}
                        </a>
                        <span>•</span>
                        <span>Slot: {apt.time_slot}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // Fast reassign to Dr. S. K. Sharma or first available
                          const altDoc = doctors.find((d) => d.is_available_today);
                          if (altDoc) {
                            rescheduleAppointment(
                              apt.id,
                              '2026-11-14',
                              '01:00 PM',
                              altDoc.id,
                              `Reassigned due to ${selectedImpactedLeave.doctor_name} absence`
                            );
                          }
                        }}
                        className="px-3 py-1.5 bg-[#245BFF] hover:bg-[#1A45C8] text-white rounded-md font-semibold transition"
                      >
                        Reassign to Available Doctor
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
