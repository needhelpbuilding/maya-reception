'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  CalendarCheck,
  UserCheck,
  Users,
  BedDouble,
  Receipt,
  HelpCircle,
  Headphones,
  Bell,
  Menu,
  X,
  PhoneCall,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function ReceptionSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { appointments, doctorLeaves, inquiries, supportMessages } = useHospital();

  // Dynamic notification counts
  const pendingAptsCount = appointments.filter((a) => a.appointment_status === 'Pending').length;
  const leaveAlertsCount = doctorLeaves.filter((l) => l.affected_appointments_count > l.rescheduled_count).length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;
  const openSupportCount = supportMessages.filter((s) => s.status === 'Open').length;

  const navItems: NavItem[] = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: CalendarCheck, badge: pendingAptsCount },
    { name: 'Doctors & Schedule', href: '/doctors', icon: UserCheck, badge: leaveAlertsCount },
    { name: 'Patients Directory', href: '/patients', icon: Users },
    { name: 'Admissions / IPD', href: '/admissions', icon: BedDouble },
    { name: 'Billing & Payments', href: '/payments', icon: Receipt },
    { name: 'Web Inquiries', href: '/inquiries', icon: HelpCircle, badge: newInquiriesCount },
    { name: 'Support Tickets', href: '/support', icon: Headphones, badge: openSupportCount },
    { name: 'Notifications & WA', href: '/notifications', icon: Bell },
  ];

  return (
    <>
      {/* Mobile Top Navbar Bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#245BFF] text-white sticky top-0 z-50 border-b border-[#1A45C8]">
        <div className="flex items-center space-x-3">
          <Image
            src="/Purple Caduceus Laurel Monogram.png"
            alt="Maya Hospital"
            width={32}
            height={32}
            className="rounded bg-white p-0.5"
          />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">Maya Hospital</h1>
            <p className="text-[10px] text-orange-200">Reception Desk</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-white hover:bg-[#1A45C8] rounded-md focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content (Desktop Persistent + Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#245BFF] text-white flex flex-col justify-between border-r border-[#1A45C8] shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Hospital Identity Header */}
          <div className="p-5 border-b border-[#1A45C8] flex items-center space-x-3.5 bg-[#245BFF]">
            <div className="relative w-11 h-11 bg-white rounded-lg p-1 shadow flex items-center justify-center flex-shrink-0">
              <Image
                src="/Purple Caduceus Laurel Monogram.png"
                alt="Maya Hospital Crest"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-[15px] font-bold text-white tracking-tight truncate">Maya Hospital</h2>
              <p className="text-xs text-orange-200 font-medium">Reception Operations</p>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] text-emerald-200 font-medium tracking-wide">OPD Active (24x7)</span>
              </div>
            </div>
          </div>

          {/* Quick Helpline Reminder */}
          <div className="mx-4 mt-3 p-2.5 bg-[#1A45C8] rounded-lg border border-[#1437A3] flex items-center justify-between text-xs text-white">
            <span className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-orange-200" />
              <span>Emergency Desk</span>
            </span>
            <a href="tel:9839752108" className="font-semibold text-white hover:text-orange-200">
              9839752108
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-orange-200 uppercase">
              Operations Center
            </div>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/overview' && pathname?.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all ${
                    active
                      ? 'bg-[#FF8A00] text-white shadow-xs font-semibold'
                      : 'text-white/90 hover:bg-[#1A45C8] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-orange-200'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        active
                          ? 'bg-white text-[#245BFF]'
                          : item.href === '/doctors'
                          ? 'bg-rose-500 text-white'
                          : 'bg-[#1A45C8] text-white border border-[#1437A3]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Current Staff Profile */}
        <div className="p-4 border-t border-[#1A45C8] bg-[#1A45C8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#FF8A00] text-white flex items-center justify-center font-bold text-xs ring-2 ring-orange-300">
                RD
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Reception Desk</p>
                <p className="text-[11px] text-orange-200">Staff Shift A</p>
              </div>
            </div>
            <button
              title="End Shift / Logout"
              className="p-1.5 text-white/80 hover:text-rose-300 hover:bg-[#1437A3] rounded transition"
              onClick={() => alert('Reception shift logged out.')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-[10px] text-white/80 text-center">
            Maya Hospital Meerpur Lakhimpur Kheri
          </div>
        </div>
      </aside>
    </>
  );
}
