export interface Doctor {
  id: string;
  slug: string;
  name: string;
  degrees: string;
  short_degrees?: string;
  designation: string;
  department_id?: string;
  department_name: string;
  experience?: string;
  image?: string;
  phone?: string;
  consultation_fee: number;
  opd_timings: string;
  is_available_today: boolean;
}

export interface Patient {
  id: string;
  patient_id_display: string;
  full_name: string;
  phone: string;
  email?: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  date_of_birth?: string;
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  total_visits: number;
  last_visit_date?: string;
  created_at: string;
}

export type AppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Checked In'
  | 'In Consultation'
  | 'Completed'
  | 'Cancelled'
  | 'No Show'
  | 'Rescheduled';

export type PaymentStatus = 'Pending' | 'Paid' | 'Partially Paid' | 'Refunded' | 'Exempt';

export interface Appointment {
  id: string;
  booking_ref: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  doctor_id: string;
  doctor_name: string;
  doctor_image?: string;
  department_name: string;
  appointment_date: string;
  time_slot: string;
  consultation_fee: number;
  appointment_status: AppointmentStatus;
  payment_status: PaymentStatus;
  payment_method?: 'Cash' | 'UPI' | 'Card' | 'Online - Razorpay' | 'Insurance';
  checkin_time?: string;
  notes?: string;
  reschedule_reason?: string;
  created_at: string;
}

export interface DoctorLeave {
  id: string;
  doctor_id: string;
  doctor_name: string;
  department_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: 'planned' | 'emergency' | 'conference' | 'sick';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  affected_appointments_count: number;
  rescheduled_count: number;
  created_at: string;
}

export interface Admission {
  id: string;
  admission_number: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  attending_doctor_name: string;
  department_name: string;
  ward_or_room: string;
  admission_date: string;
  expected_discharge_date?: string;
  actual_discharge_date?: string;
  admission_status: 'Admitted' | 'Discharged' | 'Transferred';
  discharge_notes?: string;
}

export interface PaymentRecord {
  id: string;
  receipt_number: string;
  appointment_id?: string;
  patient_name: string;
  patient_phone: string;
  amount: number;
  payment_method: 'Cash' | 'UPI' | 'Card' | 'Online - Razorpay';
  payment_status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  transaction_ref?: string;
  collected_by: string;
  payment_date: string;
}

export interface Inquiry {
  id: string;
  sender_name: string;
  sender_phone: string;
  sender_email?: string;
  category: string;
  message: string;
  status: 'New' | 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assigned_to?: string;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  patient_name: string;
  phone: string;
  channel: string;
  message: string;
  is_incoming: boolean;
  status: 'Open' | 'Replied' | 'Resolved';
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  recipient_name: string;
  phone_number: string;
  template_type: 'appointment_confirmation' | 'reminder' | 'doctor_reschedule' | 'general';
  message_content: string;
  delivery_status: 'Queued' | 'Sent' | 'Delivered' | 'Read' | 'Failed';
  sent_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}
