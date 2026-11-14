'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Search,
  PlusCircle,
  CreditCard,
  Printer,
  Download,
  CheckCircle,
  Clock,
  Phone,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';
import { PaymentRecord } from '@/types';

export default function PaymentsPage() {
  const { payments, recordPayment, appointments } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<PaymentRecord | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [method, setMethod] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [transactionRef, setTransactionRef] = useState('');

  const filteredPayments = payments.filter(
    (p) =>
      p.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receipt_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient_phone.includes(searchQuery)
  );

  const totalCollectedToday = payments
    .filter((p) => p.payment_date.startsWith('2026-11-14') && p.payment_status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordPayment({
      patient_name: patientName,
      patient_phone: patientPhone,
      amount: Number(amount),
      payment_method: method,
      payment_status: 'Completed',
      transaction_ref: transactionRef || `${method.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      collected_by: 'Reception Desk (Suyash)',
    });
    setShowCollectModal(false);
    setPatientName('');
    setPatientPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e0833] tracking-tight">
            Billing & Reception Cash Desk
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Log patient fee receipts, issue OPD receipts, and reconcile counter transactions.
          </p>
        </div>
        <button
          onClick={() => setShowCollectModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Record Counter Collection</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Today&apos;s Collection</span>
          <div className="text-2xl font-bold text-purple-900 mt-1">₹{totalCollectedToday}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% verified counter</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Receipts Issued</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{payments.length}</div>
          <span className="text-[11px] text-gray-500">Audited receipts</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">UPI / Digital Desk</span>
          <div className="text-2xl font-bold text-purple-950 mt-1">
            ₹{payments.filter((p) => p.payment_method === 'UPI').reduce((s, p) => s + p.amount, 0)}
          </div>
          <span className="text-[11px] text-purple-600 font-semibold">Direct QR Code / UPI</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Cash in Drawer</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">
            ₹{payments.filter((p) => p.payment_method === 'Cash').reduce((s, p) => s + p.amount, 0)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Ready for EOD reconciliation</span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by receipt number, patient name, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-purple-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 text-gray-800 transition"
        />
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-white text-[#240b3b] font-bold border-b border-purple-100">
                <th className="p-3.5 pl-4">Receipt #</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Transaction Ref</th>
                <th className="p-3.5">Collected By</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No payment receipts found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-purple-50/20 transition">
                    <td className="p-3.5 pl-4 font-mono font-bold text-purple-900">
                      {pay.receipt_number}
                    </td>
                    <td className="p-3.5 font-semibold text-gray-900">
                      <div>{pay.patient_name}</div>
                      <div className="text-[11px] text-gray-500 font-normal">{pay.patient_phone}</div>
                    </td>
                    <td className="p-3.5 font-bold text-base text-gray-900">
                      ₹{pay.amount}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {pay.payment_method}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-gray-600">
                      {pay.transaction_ref || '—'}
                    </td>
                    <td className="p-3.5 text-gray-600">
                      {pay.collected_by}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {pay.payment_status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <button
                        onClick={() => setSelectedReceiptForPrint(pay)}
                        className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded font-semibold transition inline-flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Counter Payment Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordPaymentSubmit}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-purple-100 space-y-4 text-xs"
          >
            <div className="flex items-center space-x-2 text-[#240b3b]">
              <Receipt className="w-5 h-5 text-purple-700" />
              <h3 className="text-base font-bold">Record Counter Collection</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Patient Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91..."
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Card">Debit / Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Transaction Ref / Note</label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref / Cash Bill No"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Issue Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-purple-200 text-xs space-y-4">
            <div className="text-center border-b pb-3">
              <h3 className="font-bold text-sm text-[#240b3b]">Maya Hospital & Multi Speciality Centre</h3>
              <p className="text-[10px] text-gray-500">Meerpur, Lakhimpur Kheri, UP - 262701</p>
              <p className="text-[10px] text-gray-500">24x7 Helpline: +91 9839752108</p>
            </div>

            <div className="space-y-1.5 py-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Receipt No:</span>
                <span className="font-mono font-bold text-gray-900">{selectedReceiptForPrint.receipt_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium text-gray-800">{selectedReceiptForPrint.payment_date.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Patient:</span>
                <span className="font-bold text-gray-900">{selectedReceiptForPrint.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-800">{selectedReceiptForPrint.patient_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-medium text-gray-800">{selectedReceiptForPrint.payment_method}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2 text-sm">
                <span className="font-bold text-gray-900">Total Paid:</span>
                <span className="font-bold text-purple-950">₹{selectedReceiptForPrint.amount}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-400 border-t pt-2">
              Computer Generated Receipt • Thank You
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedReceiptForPrint(null)}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-semibold flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
