'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Calendar,
  History,
  FileText,
  Shield,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';
import { Patient } from '@/types';

export default function PatientsPage() {
  const { patients, appointments, payments, registerPatient } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // New Patient Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [age, setAge] = useState<number>(30);
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [address, setAddress] = useState('Lakhimpur Kheri');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.patient_id_display.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPat = registerPatient({
      full_name: fullName,
      phone,
      email: email || undefined,
      gender,
      age: Number(age),
      blood_group: bloodGroup,
      address,
      emergency_contact: emergencyContact || undefined,
      emergency_phone: emergencyPhone || undefined,
    });
    setShowRegisterModal(false);
    setSelectedPatient(newPat);
    // Reset form
    setFullName('');
    setPhone('');
    setEmail('');
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter((a) => a.patient_id === patientId);
  };

  const getPatientPayments = (patientName: string) => {
    return payments.filter((p) => p.patient_name === patientName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e0833] tracking-tight">Patient Directory</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Operational demographic registry, visit records, and emergency contacts.
          </p>
        </div>
        <button
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by patient name, phone, or ID (e.g. MH-2026)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-purple-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-600 text-gray-800 transition"
        />
      </div>

      {/* Patient Directory Table */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-white text-[#240b3b] font-bold border-b border-purple-100">
                <th className="p-3.5 pl-4">Patient ID</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Contact Number</th>
                <th className="p-3.5">Age / Gender</th>
                <th className="p-3.5">Blood Group</th>
                <th className="p-3.5">Visits</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No registered patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-purple-50/20 transition">
                    <td className="p-3.5 pl-4 font-mono font-bold text-purple-900">
                      {patient.patient_id_display}
                    </td>
                    <td className="p-3.5 font-semibold text-gray-900">
                      {patient.full_name}
                    </td>
                    <td className="p-3.5">
                      <a
                        href={`tel:${patient.phone}`}
                        className="text-purple-700 hover:underline flex items-center space-x-1 font-medium"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{patient.phone}</span>
                      </a>
                    </td>
                    <td className="p-3.5">
                      {patient.age} Yrs / {patient.gender}
                    </td>
                    <td className="p-3.5 font-semibold text-purple-950">
                      {patient.blood_group || '—'}
                    </td>
                    <td className="p-3.5 font-medium text-gray-700">
                      {patient.total_visits} Visits
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded font-semibold transition inline-flex items-center space-x-1"
                      >
                        <span>View Profile</span>
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

      {/* Patient Operational Profile Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-purple-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {selectedPatient.patient_id_display}
                </span>
                <h3 className="text-lg font-bold text-[#1e0833] mt-1">
                  {selectedPatient.full_name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedPatient.gender} • {selectedPatient.age} Years • Blood Group: {selectedPatient.blood_group || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Demographics & Emergency Contacts */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-purple-50/40 p-4 rounded-lg">
              <div>
                <span className="text-gray-500 block">Primary Contact:</span>
                <span className="font-semibold text-gray-900">{selectedPatient.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Address:</span>
                <span className="font-semibold text-gray-900">{selectedPatient.address || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Emergency Contact:</span>
                <span className="font-semibold text-gray-900">{selectedPatient.emergency_contact || '—'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Emergency Phone:</span>
                <span className="font-semibold text-gray-900">{selectedPatient.emergency_phone || '—'}</span>
              </div>
            </div>

            {/* Privacy Notice (Sensitive Clinical Records Masked) */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2 text-xs text-blue-800">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                <strong>Clinical Privacy Protocol:</strong> Detailed diagnostics, doctor prescriptions, and medical histories are restricted to authorized clinical staff.
              </span>
            </div>

            {/* Appointment History */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Recent Appointment History
              </h4>
              <div className="divide-y border rounded-lg overflow-hidden text-xs">
                {getPatientAppointments(selectedPatient.id).length === 0 ? (
                  <div className="p-3 text-gray-500 text-center">No appointment records.</div>
                ) : (
                  getPatientAppointments(selectedPatient.id).map((apt) => (
                    <div key={apt.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-900">{apt.doctor_name}</span>
                        <span className="text-gray-500 ml-2">({apt.department_name})</span>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {apt.appointment_date} at {apt.time_slot}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
                        {apt.appointment_status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Close button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Patient Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterSubmit}
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-purple-100 space-y-4 max-h-[90vh] overflow-y-auto text-xs"
          >
            <div className="flex items-center space-x-2 text-[#240b3b]">
              <UserPlus className="w-5 h-5 text-purple-700" />
              <h3 className="text-base font-bold">Register New Patient</h3>
            </div>
            <p className="text-gray-500">
              Enter official demographic details for hospital reception registration.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9839..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="patient@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">City / Village</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  placeholder="Relative Name"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  placeholder="+91..."
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
