'use client';

import React, { useState } from 'react';
import {
  Headphones,
  Search,
  MessageSquare,
  Send,
  Phone,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';

export default function SupportPage() {
  const { supportMessages } = useHospital();
  const [messages, setMessages] = useState(supportMessages);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(messages[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const activeMessage = messages.find((m) => m.id === activeMessageId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    setMessages((prev) =>
      prev.map((m) => (m.id === activeMessage.id ? { ...m, status: 'Replied' } : m))
    );
    setReplyText('');
    alert('Operational reply recorded and queued.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#245BFF] tracking-tight">Patient Support Desk</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Handle incoming patient portal requests, discharge document inquiries, and operational queries.
        </p>
      </div>

      {/* Split Support Conversation Workspace */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[500px] overflow-hidden">
        {/* Left List */}
        <div className="border-r border-gray-100 divide-y divide-gray-100 overflow-y-auto">
          <div className="p-3 bg-orange-50/50 text-xs font-bold text-[#245BFF] uppercase tracking-wider">
            Patient Support Tickets ({messages.length})
          </div>
          {messages.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMessageId(item.id)}
              className={`w-full text-left p-3.5 hover:bg-orange-50/30 transition block ${
                activeMessageId === item.id ? 'bg-orange-50/60 border-l-4 border-purple-700' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900">{item.patient_name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    item.status === 'Open'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.message}</p>
              <span className="text-[10px] text-gray-400 mt-1 block font-mono">
                {item.created_at.slice(0, 10)} via {item.channel}
              </span>
            </button>
          ))}
        </div>

        {/* Right Active Conversation Pane */}
        <div className="md:col-span-2 flex flex-col justify-between p-6">
          {activeMessage ? (
            <>
              <div>
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{activeMessage.patient_name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                      <Phone className="w-3 h-3 text-[#245BFF]" />
                      <a href={`tel:${activeMessage.phone}`} className="hover:underline text-[#245BFF]">
                        {activeMessage.phone}
                      </a>
                      <span>•</span>
                      <span>Channel: {activeMessage.channel}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-orange-50 text-[#EA580C] font-semibold px-2.5 py-1 rounded-full border border-orange-200">
                    Status: {activeMessage.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-50/60 p-4 rounded-xl border border-slate-200 max-w-lg">
                    <p className="text-xs font-semibold text-[#245BFF] mb-1">
                      {activeMessage.patient_name}:
                    </p>
                    <p className="text-xs text-gray-800 leading-relaxed">{activeMessage.message}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block text-right">
                      {activeMessage.created_at.slice(11, 16)}
                    </span>
                  </div>

                  {activeMessage.status === 'Replied' && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 max-w-lg ml-auto">
                      <p className="text-xs font-semibold text-emerald-950 mb-1">
                        Reception Desk (Suyash):
                      </p>
                      <p className="text-xs text-gray-800 leading-relaxed">
                        Your request has been processed. The billing and discharge records have been verified and forwarded to your registered WhatsApp number.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="mt-6 border-t pt-4">
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Type official reception reply or internal resolution note..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#245BFF] focus:bg-white text-gray-800"
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-[#245BFF] hover:bg-[#1A45C8] text-white rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5 ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Response</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center text-sm text-gray-400 m-auto">
              Select a conversation to view and respond.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
