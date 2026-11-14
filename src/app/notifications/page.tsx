'use client';

import React, { useState } from 'react';
import {
  Bell,
  Send,
  MessageSquare,
  CheckCheck,
  Clock,
  AlertCircle,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';
import { NotificationRecord } from '@/types';

export default function NotificationsPage() {
  const { notifications, appointments, sendWhatsAppNotification } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkTemplate, setBulkTemplate] = useState('morning_opd_reminder');
  const [customBulkText, setCustomBulkText] = useState(
    'Maya Hospital Notice: Please ensure you arrive 15 minutes before your scheduled appointment time. Free parking and reception queue assistance are active.'
  );

  const filteredNotifications = notifications.filter(
    (n) =>
      n.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.phone_number.includes(searchQuery) ||
      n.message_content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayApts = appointments.filter((a) => a.appointment_date === '2026-11-14');
    todayApts.forEach((apt) => {
      sendWhatsAppNotification(
        apt.patient_name,
        apt.patient_phone,
        'reminder',
        `Dear ${apt.patient_name}, ${customBulkText}`
      );
    });
    setShowBulkModal(false);
    alert(`Dispatched WhatsApp reminders to ${todayApts.length} eligible scheduled patients.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e0833] tracking-tight">
            WhatsApp Communication Centre & Delivery Logs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time patient notification log, delivery confirmations, and bulk appointment reminders.
          </p>
        </div>
        <button
          onClick={() => setShowBulkModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Bulk OPD Reminders</span>
        </button>
      </div>

      {/* Integration Status Notice */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center space-x-2">
          <CheckCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Official WhatsApp Business Boundary:</strong> Messages are logged with recipient numbers, template identifiers, timestamps, and verifiable delivery states.
          </span>
        </div>
        <span className="font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px]">
          Gateway Active
        </span>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by recipient name, phone or message text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-purple-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 text-gray-800 transition"
        />
      </div>

      {/* Notifications Log Table */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-white text-[#240b3b] font-bold border-b border-purple-100">
                <th className="p-3.5 pl-4">Recipient</th>
                <th className="p-3.5">Template</th>
                <th className="p-3.5">Message Content</th>
                <th className="p-3.5">Dispatched At</th>
                <th className="p-3.5 text-right pr-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No notifications logged yet.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-purple-50/20 transition">
                    <td className="p-3.5 pl-4 font-bold text-gray-900">
                      <div>{notif.recipient_name}</div>
                      <div className="text-[11px] font-mono text-purple-700">{notif.phone_number}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {notif.template_type}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-md text-gray-700">
                      {notif.message_content}
                    </td>
                    <td className="p-3.5 text-gray-500">
                      {notif.created_at.slice(11, 16)} • {notif.created_at.slice(0, 10)}
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <span
                        className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          notif.delivery_status === 'Delivered' || notif.delivery_status === 'Read'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>{notif.delivery_status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Broadcast Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleSendBulkSubmit}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-100 space-y-4 text-xs"
          >
            <div className="flex items-center space-x-2 text-emerald-800">
              <Send className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold">Broadcast Bulk OPD Reminder</h3>
            </div>
            <p className="text-gray-500">
              Send verified WhatsApp reminders to all patients booked for today&apos;s active clinic slots.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Approved Template</label>
                <select
                  value={bulkTemplate}
                  onChange={(e) => setBulkTemplate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="morning_opd_reminder">Morning OPD General Reminder</option>
                  <option value="doctor_schedule_update">Doctor Schedule & Entry Instructions</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message Text Preview</label>
                <textarea
                  rows={4}
                  value={customBulkText}
                  onChange={(e) => setCustomBulkText(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Confirm & Dispatch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
