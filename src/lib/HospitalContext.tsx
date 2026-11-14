'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  Patient,
  Appointment,
  DoctorLeave,
  Admission,
  PaymentRecord,
  Inquiry,
  SupportMessage,
  NotificationRecord,
  AuditLog,
  AppointmentStatus,
  PaymentStatus,
} from '@/types';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_LEAVES,
  INITIAL_ADMISSIONS,
  INITIAL_PAYMENTS,
  INITIAL_INQUIRIES,
  INITIAL_SUPPORT,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '@/lib/initialData';

interface HospitalContextType {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  doctorLeaves: DoctorLeave[];
  admissions: Admission[];
  payments: PaymentRecord[];
  inquiries: Inquiry[];
  supportMessages: SupportMessage[];
  notifications: NotificationRecord[];
  auditLogs: AuditLog[];
  
  // Operational Actions
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus, method?: 'Cash' | 'UPI' | 'Card' | 'Online - Razorpay') => void;
  rescheduleAppointment: (id: string, newDate: string, newSlot: string, doctorId: string, reason: string) => void;
  cancelAppointment: (id: string, reason: string) => void;
  recordDoctorAbsence: (doctorId: string, reason: string, leaveType: 'planned' | 'emergency' | 'conference' | 'sick') => void;
  registerPatient: (patient: Omit<Patient, 'id' | 'patient_id_display' | 'total_visits' | 'created_at'>) => Patient;
  registerAdmission: (admission: Omit<Admission, 'id' | 'admission_number'>) => void;
  recordDischarge: (admissionId: string, notes: string) => void;
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'receipt_number' | 'payment_date'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  sendWhatsAppNotification: (recipient: string, phone: string, type: NotificationRecord['template_type'], message: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_doctors');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_DOCTORS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_patients');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_appointments');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_APPOINTMENTS;
  });

  const [doctorLeaves, setDoctorLeaves] = useState<DoctorLeave[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_leaves');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_LEAVES;
  });

  const [admissions, setAdmissions] = useState<Admission[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_admissions');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_ADMISSIONS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_payments');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_PAYMENTS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_inquiries');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_INQUIRIES;
  });

  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_support');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_SUPPORT;
  });

  const [notifications, setNotifications] = useState<NotificationRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_notifs');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mh_audit');
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Persist to local storage for realistic demo experience
  useEffect(() => {
    localStorage.setItem('mh_doctors', JSON.stringify(doctors));
  }, [doctors]);
  useEffect(() => {
    localStorage.setItem('mh_patients', JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem('mh_appointments', JSON.stringify(appointments));
  }, [appointments]);
  useEffect(() => {
    localStorage.setItem('mh_leaves', JSON.stringify(doctorLeaves));
  }, [doctorLeaves]);
  useEffect(() => {
    localStorage.setItem('mh_admissions', JSON.stringify(admissions));
  }, [admissions]);
  useEffect(() => {
    localStorage.setItem('mh_payments', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem('mh_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);
  useEffect(() => {
    localStorage.setItem('mh_notifications', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('mh_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Log Audit Action Helper
  const logAudit = (action: string, entity_type: string, entity_id: string, details?: Record<string, unknown>) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      actor_name: 'Reception Desk (Active Staff)',
      actor_role: 'receptionist',
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = { ...apt, appointment_status: status };
          if (status === 'Checked In' && !apt.checkin_time) {
            updated.checkin_time = new Date().toISOString();
          }
          logAudit('UPDATE_APPOINTMENT_STATUS', 'appointment', apt.booking_ref, { status, previous: apt.appointment_status });
          return updated;
        }
        return apt;
      })
    );
  };

  const updatePaymentStatus = (
    id: string,
    status: PaymentStatus,
    method: 'Cash' | 'UPI' | 'Card' | 'Online - Razorpay' = 'Cash'
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = { ...apt, payment_status: status, payment_method: method };
          logAudit('COLLECT_APPOINTMENT_PAYMENT', 'appointment', apt.booking_ref, { status, method, amount: apt.consultation_fee });
          
          if (status === 'Paid') {
            const newPayment: PaymentRecord = {
              id: `pay-${Date.now()}`,
              receipt_number: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
              appointment_id: apt.id,
              patient_name: apt.patient_name,
              patient_phone: apt.patient_phone,
              amount: apt.consultation_fee,
              payment_method: method,
              payment_status: 'Completed',
              transaction_ref: `${method.toUpperCase()}-${Date.now().toString().slice(-6)}`,
              collected_by: 'Reception Desk (Suyash)',
              payment_date: new Date().toISOString(),
            };
            setPayments((p) => [newPayment, ...p]);
          }
          return updated;
        }
        return apt;
      })
    );
  };

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newSlot: string,
    doctorId: string,
    reason: string
  ) => {
    const doc = doctors.find((d) => d.id === doctorId);
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          logAudit('RESCHEDULE_APPOINTMENT', 'appointment', apt.booking_ref, {
            old_date: apt.appointment_date,
            old_slot: apt.time_slot,
            newDate,
            newSlot,
            newDoctor: doc ? doc.name : apt.doctor_name,
            reason,
          });

          // Enqueue WhatsApp notification
          sendWhatsAppNotification(
            apt.patient_name,
            apt.patient_phone,
            'doctor_reschedule',
            `Dear ${apt.patient_name}, your appointment at Maya Hospital has been rescheduled to ${newDate} at ${newSlot} with ${doc ? doc.name : apt.doctor_name}. Reason: ${reason}`
          );

          return {
            ...apt,
            appointment_date: newDate,
            time_slot: newSlot,
            doctor_id: doctorId,
            doctor_name: doc ? doc.name : apt.doctor_name,
            department_name: doc ? doc.department_name : apt.department_name,
            appointment_status: 'Rescheduled',
            reschedule_reason: reason,
          };
        }
        return apt;
      })
    );
  };

  const cancelAppointment = (id: string, reason: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          logAudit('CANCEL_APPOINTMENT', 'appointment', apt.booking_ref, { reason });
          sendWhatsAppNotification(
            apt.patient_name,
            apt.patient_phone,
            'general',
            `Dear ${apt.patient_name}, your appointment (${apt.booking_ref}) at Maya Hospital has been cancelled. Note: ${reason}`
          );
          return {
            ...apt,
            appointment_status: 'Cancelled',
            notes: `${apt.notes || ''} [Cancelled: ${reason}]`,
          };
        }
        return apt;
      })
    );
  };

  const recordDoctorAbsence = (
    doctorId: string,
    reason: string,
    leaveType: 'planned' | 'emergency' | 'conference' | 'sick'
  ) => {
    const doc = doctors.find((d) => d.id === doctorId);
    if (!doc) return;

    // Toggle doctor availability
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctorId ? { ...d, is_available_today: false } : d))
    );

    const todayStr = '2026-11-14';
    const affectedApts = appointments.filter(
      (a) => a.doctor_id === doctorId && a.appointment_date === todayStr && a.appointment_status !== 'Cancelled'
    );

    const newLeave: DoctorLeave = {
      id: `leave-${Date.now()}`,
      doctor_id: doctorId,
      doctor_name: doc.name,
      department_name: doc.department_name,
      start_date: todayStr,
      end_date: todayStr,
      reason,
      leave_type: leaveType,
      status: 'approved',
      affected_appointments_count: affectedApts.length,
      rescheduled_count: 0,
      created_at: new Date().toISOString(),
    };

    setDoctorLeaves((prev) => [newLeave, ...prev]);
    logAudit('MARK_DOCTOR_ABSENT', 'doctor_leave', newLeave.id, {
      doctor: doc.name,
      reason,
      affectedPatientsCount: affectedApts.length,
    });
  };

  const registerPatient = (
    data: Omit<Patient, 'id' | 'patient_id_display' | 'total_visits' | 'created_at'>
  ): Patient => {
    const newPatient: Patient = {
      ...data,
      id: `pat-${Date.now()}`,
      patient_id_display: `MH-2026-0${Math.floor(109 + Math.random() * 900)}`,
      total_visits: 1,
      created_at: new Date().toISOString(),
    };
    setPatients((prev) => [newPatient, ...prev]);
    logAudit('REGISTER_PATIENT', 'patient', newPatient.patient_id_display, { name: newPatient.full_name, phone: newPatient.phone });
    return newPatient;
  };

  const registerAdmission = (admission: Omit<Admission, 'id' | 'admission_number'>) => {
    const newAdm: Admission = {
      ...admission,
      id: `adm-${Date.now()}`,
      admission_number: `ADM-2026-0${Math.floor(83 + Math.random() * 900)}`,
    };
    setAdmissions((prev) => [newAdm, ...prev]);
    logAudit('REGISTER_INPATIENT_ADMISSION', 'admission', newAdm.admission_number, {
      patient: newAdm.patient_name,
      ward: newAdm.ward_or_room,
    });
  };

  const recordDischarge = (admissionId: string, notes: string) => {
    setAdmissions((prev) =>
      prev.map((adm) => {
        if (adm.id === admissionId) {
          logAudit('DISCHARGE_INPATIENT', 'admission', adm.admission_number, { notes });
          return {
            ...adm,
            admission_status: 'Discharged',
            actual_discharge_date: new Date().toISOString(),
            discharge_notes: notes,
          };
        }
        return adm;
      })
    );
  };

  const recordPayment = (payment: Omit<PaymentRecord, 'id' | 'receipt_number' | 'payment_date'>) => {
    const newPay: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
      receipt_number: `REC-${Math.floor(8300 + Math.random() * 1000)}`,
      payment_date: new Date().toISOString(),
    };
    setPayments((prev) => [newPay, ...prev]);
    logAudit('RECORD_OFFLINE_PAYMENT', 'payment', newPay.receipt_number, {
      amount: newPay.amount,
      patient: newPay.patient_name,
      method: newPay.payment_method,
    });
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === id) {
          logAudit('UPDATE_INQUIRY_STATUS', 'inquiry', inq.id, { status, sender: inq.sender_name });
          return { ...inq, status };
        }
        return inq;
      })
    );
  };

  const sendWhatsAppNotification = (
    recipient: string,
    phone: string,
    template_type: NotificationRecord['template_type'],
    message_content: string
  ) => {
    const newNotif: NotificationRecord = {
      id: `notif-${Date.now()}`,
      recipient_name: recipient,
      phone_number: phone,
      template_type,
      message_content,
      delivery_status: 'Delivered', // Demo provider response simulation
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    logAudit('SEND_WHATSAPP_NOTIFICATION', 'notification', newNotif.id, {
      recipient,
      phone,
      template_type,
    });
  };

  return (
    <HospitalContext.Provider
      value={{
        doctors,
        patients,
        appointments,
        doctorLeaves,
        admissions,
        payments,
        inquiries,
        supportMessages,
        notifications,
        auditLogs,
        updateAppointmentStatus,
        updatePaymentStatus,
        rescheduleAppointment,
        cancelAppointment,
        recordDoctorAbsence,
        registerPatient,
        registerAdmission,
        recordDischarge,
        recordPayment,
        updateInquiryStatus,
        sendWhatsAppNotification,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
