'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Plus,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  User,
  CreditCard,
  Send,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';
import { AppointmentStatus, PaymentStatus } from '@/types';

export default function AppointmentsPage() {
  const {
    appointments,
    doctors,
    updateAppointmentStatus,
    updatePaymentStatus,
    rescheduleAppointment,
    cancelAppointment,
    sendWhatsAppNotification,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2026-11-14');

  // Reschedule Modal State
  const [reschedulingApt, setReschedulingApt] = useState<any | null>(null);
  const [newDate, setNewDate] = useState('2026-11-15');
  const [newSlot, setNewSlot] = useState('10:00 AM');
  const [newDoctorId, setNewDoctorId] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('Doctor availability adjustment');

  // Cancel Modal State
  const [cancellingApt, setCancellingApt] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('Patient requested cancellation');

  // WhatsApp Message Preview Modal State
  const [waModalApt, setWaModalApt] = useState<any | null>(null);
  const [customWaMessage, setCustomWaMessage] = useState('');

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patient_phone.includes(searchQuery) ||
      apt.booking_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDoctor = selectedDoctor === 'all' || apt.doctor_id === selectedDoctor;
    const matchesStatus = selectedStatus === 'all' || apt.appointment_status === selectedStatus;
    const matchesDate = !selectedDate || apt.appointment_date === selectedDate;

    return matchesSearch && matchesDoctor && matchesStatus && matchesDate;
  });

  const availableSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
  ];

  const handleOpenReschedule = (apt: any) => {
    setReschedulingApt(apt);
    setNewDoctorId(apt.doctor_id);
    setNewDate('2026-11-15');
    setNewSlot('10:00 AM');
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApt) return;
    rescheduleAppointment(
      reschedulingApt.id,
      newDate,
      newSlot,
      newDoctorId || reschedulingApt.doctor_id,
      rescheduleReason
    );
    setReschedulingApt(null);
  };

  const handleOpenCancel = (apt: any) => {
    setCancellingApt(apt);
  };

  const handleConfirmCancel = () => {
    if (!cancellingApt) return;
    cancelAppointment(cancellingApt.id, cancelReason);
    setCancellingApt(null);
  };

  const handleOpenWhatsAppModal = (apt: any) => {
    setWaModalApt(apt);
    setCustomWaMessage(
      `Hello ${apt.patient_name}, this is an update regarding your appointment ${apt.booking_ref} with ${apt.doctor_name} at Maya Hospital scheduled on ${apt.appointment_date} at ${apt.time_slot}. Please reach the reception 15 minutes in advance.`
    );
  };

  const handleSendWhatsApp = () => {
    if (!waModalApt) return;
    sendWhatsAppNotification(
      waModalApt.patient_name,
      waModalApt.patient_phone,
      'reminder',
      customWaMessage
    );
    setWaModalApt(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e0833] tracking-tight">Appointment Operations</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Book, reschedule, check in patients, collect fees, and coordinate doctor consultations.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search name, phone, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-800 transition"
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-800 transition"
          />
        </div>

        {/* Doctor Filter */}
        <div>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-800 transition"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department_name})
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 focus:bg-white text-gray-800 transition"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-white text-[#240b3b] font-bold border-b border-purple-100">
                <th className="p-3.5 pl-4">Booking Ref</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Doctor & Dept</th>
                <th className="p-3.5">Date & Slot</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Fee & Payment</th>
                <th className="p-3.5 text-right pr-4">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No appointments match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-purple-50/20 transition">
                    {/* Booking Ref */}
                    <td className="p-3.5 pl-4 font-bold text-purple-900">
                      <span className="font-mono">{apt.booking_ref}</span>
                    </td>

                    {/* Patient */}
                    <td className="p-3.5">
                      <div className="font-semibold text-gray-900">{apt.patient_name}</div>
                      <div className="flex items-center space-x-1.5 text-gray-500 mt-0.5">
                        <a
                          href={`tel:${apt.patient_phone}`}
                          className="text-purple-700 hover:underline flex items-center space-x-1 font-medium"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{apt.patient_phone}</span>
                        </a>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="p-3.5">
                      <div className="font-medium text-gray-900">{apt.doctor_name}</div>
                      <div className="text-[11px] text-gray-500">{apt.department_name}</div>
                    </td>

                    {/* Slot */}
                    <td className="p-3.5">
                      <div className="font-bold text-gray-900">{apt.time_slot}</div>
                      <div className="text-[11px] text-gray-500">{apt.appointment_date}</div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.appointment_status === 'Checked In'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : apt.appointment_status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.appointment_status === 'In Consultation'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : apt.appointment_status === 'Completed'
                            ? 'bg-gray-100 text-gray-800'
                            : apt.appointment_status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : apt.appointment_status === 'Rescheduled'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-yellow-50 text-yellow-800'
                        }`}
                      >
                        {apt.appointment_status}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="p-3.5">
                      <div className="font-bold text-gray-900">₹{apt.consultation_fee}</div>
                      <div className="mt-0.5">
                        {apt.payment_status === 'Paid' ? (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Paid ({apt.payment_method || 'Cash'})
                          </span>
                        ) : (
                          <button
                            onClick={() => updatePaymentStatus(apt.id, 'Paid', 'Cash')}
                            className="text-[10px] bg-purple-50 text-purple-800 hover:bg-purple-100 px-1.5 py-0.5 rounded font-semibold border border-purple-200 transition"
                          >
                            Collect Now
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Check-in */}
                        {apt.appointment_status !== 'Checked In' && apt.appointment_status !== 'Completed' && (
                          <button
                            title="Mark Patient Arrived"
                            onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 transition"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* WhatsApp Message */}
                        <button
                          title="Send WhatsApp Reminder / Update"
                          onClick={() => handleOpenWhatsAppModal(apt)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        {/* Reschedule */}
                        <button
                          title="Reschedule Appointment"
                          onClick={() => handleOpenReschedule(apt)}
                          className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded border border-amber-200 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        {/* Cancel */}
                        {apt.appointment_status !== 'Cancelled' && (
                          <button
                            title="Cancel Appointment"
                            onClick={() => handleOpenCancel(apt)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-purple-100 space-y-4">
            <h3 className="text-base font-bold text-[#1e0833]">
              Reschedule Appointment ({reschedulingApt.booking_ref})
            </h3>
            <p className="text-xs text-gray-500">
              Select an alternative date, available slot, or reassigned doctor for {reschedulingApt.patient_name}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assign Doctor</label>
                <select
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id} disabled={!d.is_available_today}>
                      {d.name} - {d.department_name} {!d.is_available_today ? '(Absent Today)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                >
                </input>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Available Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Rescheduling Reason</label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setReschedulingApt(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Confirm & Notify Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-rose-100 space-y-4">
            <h3 className="text-base font-bold text-rose-900">
              Cancel Appointment ({cancellingApt.booking_ref})
            </h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to cancel the booking for {cancellingApt.patient_name}? This action will be logged in the audit log.
            </p>

            <div className="text-xs">
              <label className="block font-semibold text-gray-700 mb-1">Cancellation Reason</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-600"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setCancellingApt(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      {waModalApt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-100 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Send className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold">Send Patient WhatsApp Notification</h3>
            </div>
            <p className="text-xs text-gray-500">
              Recipient: <strong>{waModalApt.patient_name}</strong> ({waModalApt.patient_phone})
            </p>

            <div className="text-xs">
              <label className="block font-semibold text-gray-700 mb-1">Message Preview</label>
              <textarea
                rows={4}
                value={customWaMessage}
                onChange={(e) => setCustomWaMessage(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setWaModalApt(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
