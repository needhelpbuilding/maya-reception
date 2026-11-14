'use client';

import React, { useState } from 'react';
import {
  BedDouble,
  UserPlus,
  Search,
  CheckCircle,
  Phone,
  Clock,
  Building,
  UserCheck,
} from 'lucide-react';
import { useHospital } from '@/lib/HospitalContext';

export default function AdmissionsPage() {
  const { admissions, registerAdmission, recordDischarge, doctors, patients } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [selectedDischargeAdm, setSelectedDischargeAdm] = useState<any | null>(null);
  const [dischargeNotes, setDischargeNotes] = useState('Patient stabilized and discharged in good condition.');

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState('Dr. S. K. Sharma');
  const [departmentName, setDepartmentName] = useState('General Medicine');
  const [wardOrRoom, setWardOrRoom] = useState('General Ward Bed 05');

  const filteredAdmissions = admissions.filter(
    (a) =>
      a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ward_or_room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.admission_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegisterAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === selectedPatientId);
    if (!pat) return;

    registerAdmission({
      patient_id: pat.id,
      patient_name: pat.full_name,
      patient_phone: pat.phone,
      attending_doctor_name: selectedDoctorName,
      department_name: departmentName,
      ward_or_room: wardOrRoom,
      admission_date: new Date().toISOString(),
      admission_status: 'Admitted',
    });
    setShowAdmissionModal(false);
  };

  const handleConfirmDischarge = () => {
    if (!selectedDischargeAdm) return;
    recordDischarge(selectedDischargeAdm.id, dischargeNotes);
    setSelectedDischargeAdm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#245BFF] tracking-tight">
            Inpatient Admissions & Discharges (IPD)
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage bed allocations, admit patients, and track operational discharge clearances.
          </p>
        </div>
        <button
          onClick={() => setShowAdmissionModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#245BFF] hover:bg-[#1A45C8] text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New Inpatient Admission</span>
        </button>
      </div>

      {/* Ward Occupancy Overview Quick Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Currently Admitted</span>
          <div className="text-2xl font-bold text-[#245BFF] mt-1">
            {admissions.filter((a) => a.admission_status === 'Admitted').length}
          </div>
          <span className="text-[11px] text-[#EA580C] font-semibold">Active in wards</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Discharged (This Week)</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {admissions.filter((a) => a.admission_status === 'Discharged').length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Clearances completed</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">ICU Beds Occupied</span>
          <div className="text-2xl font-bold text-rose-700 mt-1">1 / 6</div>
          <span className="text-[11px] text-rose-600 font-semibold">5 ICU beds free</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Total Ward Capacity</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">30 Beds</div>
          <span className="text-[11px] text-gray-400">Multi-Speciality Wings</span>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Filter by patient, room or admission ref..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-orange-200 rounded-lg text-xs focus:ring-2 focus:ring-[#245BFF] text-gray-800 transition"
        />
      </div>

      {/* Admissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[#245BFF] font-bold border-b border-slate-200">
                <th className="p-3.5 pl-4">Admission #</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Ward / Room</th>
                <th className="p-3.5">Attending Doctor</th>
                <th className="p-3.5">Admission Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No admission records found.
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-orange-50/30 transition">
                    <td className="p-3.5 pl-4 font-mono font-bold text-[#245BFF]">
                      {adm.admission_number}
                    </td>
                    <td className="p-3.5 font-semibold text-gray-900">
                      <div>{adm.patient_name}</div>
                      <a href={`tel:${adm.patient_phone}`} className="text-[#245BFF] hover:underline flex items-center space-x-1 text-[11px] font-normal mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{adm.patient_phone}</span>
                      </a>
                    </td>
                    <td className="p-3.5 font-bold text-[#245BFF]">
                      {adm.ward_or_room}
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-gray-900">{adm.attending_doctor_name}</div>
                      <div className="text-[11px] text-gray-500">{adm.department_name}</div>
                    </td>
                    <td className="p-3.5 text-gray-600">
                      {adm.admission_date.slice(0, 10)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          adm.admission_status === 'Admitted'
                            ? 'bg-orange-100 text-[#EA580C] border border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {adm.admission_status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      {adm.admission_status === 'Admitted' ? (
                        <button
                          onClick={() => setSelectedDischargeAdm(adm)}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 font-semibold transition"
                        >
                          Record Discharge
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Discharged</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Inpatient Admission Modal */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterAdmission}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center space-x-2 text-[#245BFF]">
              <BedDouble className="w-5 h-5 text-[#245BFF]" />
              <h3 className="text-base font-bold">Admit Patient to IPD</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#245BFF]"
                >
                  <option value="">-- Choose Registered Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.patient_id_display}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Attending Doctor</label>
                <select
                  value={selectedDoctorName}
                  onChange={(e) => setSelectedDoctorName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#245BFF]"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.department_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Ward / Room Allocation *</label>
                <input
                  type="text"
                  required
                  value={wardOrRoom}
                  onChange={(e) => setWardOrRoom(e.target.value)}
                  placeholder="e.g. ICU Bed 02, General Ward Bed 08"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#245BFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#245BFF]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdmissionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#245BFF] hover:bg-[#1A45C8] text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Confirm Admission
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Record Discharge Modal */}
      {selectedDischargeAdm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-100 space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">
              Discharge Clearance ({selectedDischargeAdm.admission_number})
            </h3>
            <p className="text-gray-500">
              Confirm operational discharge for <strong>{selectedDischargeAdm.patient_name}</strong> from <strong>{selectedDischargeAdm.ward_or_room}</strong>.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Administrative Discharge Notes</label>
              <textarea
                rows={3}
                value={dischargeNotes}
                onChange={(e) => setDischargeNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedDischargeAdm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDischarge}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                Complete Discharge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
