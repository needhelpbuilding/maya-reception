'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';
import { Inquiry } from '@/types';

export default function InquiriesPage() {
  const { inquiries, updateInquiryStatus } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sender_phone.includes(searchQuery) ||
      i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#245BFF] tracking-tight">
            Website & Public Inquiries
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Incoming inquiries from the hospital landing page, health checkup inquiries, and surgery consultation requests.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search inquiries by sender, phone or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-orange-200 rounded-lg text-xs focus:ring-2 focus:ring-[#245BFF] text-gray-800 transition"
        />
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[#245BFF] font-bold border-b border-slate-200">
                <th className="p-3.5 pl-4">Sender Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Message Excerpt</th>
                <th className="p-3.5">Contact Number</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-orange-50/30 transition">
                    <td className="p-3.5 pl-4 font-bold text-gray-900">
                      {inq.sender_name}
                      {inq.sender_email && (
                        <div className="text-[10px] text-gray-400 font-normal">{inq.sender_email}</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-[#245BFF] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {inq.category}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-gray-600">
                      {inq.message}
                    </td>
                    <td className="p-3.5">
                      <a
                        href={`tel:${inq.sender_phone}`}
                        className="text-[#245BFF] hover:underline flex items-center space-x-1 font-medium"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{inq.sender_phone}</span>
                      </a>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          inq.status === 'New'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : inq.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#245BFF] border border-orange-200 rounded font-semibold transition inline-flex items-center space-x-1"
                      >
                        <span>Open Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-orange-50 text-[#EA580C] px-2 py-0.5 rounded border border-orange-200">
                  {selectedInquiry.category}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  Inquiry from {selectedInquiry.sender_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Phone:</span>
                <a href={`tel:${selectedInquiry.sender_phone}`} className="font-bold text-[#245BFF] hover:underline">
                  {selectedInquiry.sender_phone}
                </a>
              </div>
              {selectedInquiry.sender_email && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-800">{selectedInquiry.sender_email}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Received At:</span>
                <span className="font-medium text-gray-800">{selectedInquiry.created_at.slice(0, 16).replace('T', ' ')}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700">
              <span className="block font-bold text-gray-900 mb-1">Message Content:</span>
              <p className="leading-relaxed">{selectedInquiry.message}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-gray-500">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => {
                    updateInquiryStatus(selectedInquiry.id, e.target.value as any);
                    setSelectedInquiry({ ...selectedInquiry, status: e.target.value as any });
                  }}
                  className="p-1.5 border border-gray-300 rounded font-semibold text-xs text-gray-800"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <a
                href={`tel:${selectedInquiry.sender_phone}`}
                className="px-3 py-1.5 bg-[#245BFF] hover:bg-[#1A45C8] text-white rounded font-semibold flex items-center space-x-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Patient</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
