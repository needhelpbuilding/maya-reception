-- ============================================================================
-- MAYA HOSPITAL & MULTI SPECIALITY CENTRE: UNIFIED OPERATIONS SCHEMA
-- ============================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- 1. Departments Table
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  slug text not null unique,
  description text,
  icon_name text,
  emergency_support boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Profiles (Staff & Receptionists)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  role text not null check (role in ('receptionist', 'doctor', 'founder', 'admin', 'nurse')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Doctors Table
create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  degrees text not null,
  short_degrees text,
  designation text not null,
  department_id uuid references public.departments(id) on delete set null,
  department_name text not null,
  experience text,
  image text,
  phone text,
  consultation_fee numeric(10, 2) not null default 500.00,
  opd_timings text not null default '10:00 AM - 02:00 PM',
  is_available_today boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Doctor Schedules (Slot Templates)
create table if not exists public.doctor_schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6), -- 0=Sunday, 6=Saturday
  start_time time not null,
  end_time time not null,
  slot_duration_mins int not null default 15,
  max_patients_per_slot int not null default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 5. Doctor Leaves & Emergency Absences
create table if not exists public.doctor_leaves (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null,
  leave_type text not null default 'planned' check (leave_type in ('planned', 'emergency', 'conference', 'sick')),
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  affected_appointments_count int default 0,
  rescheduled_count int default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 6. Patients Directory (Clean Demographics, Clinical History Isolated)
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_id_display text not null unique, -- e.g. "MH-2026-0042"
  full_name text not null,
  phone text not null,
  email text,
  gender text check (gender in ('Male', 'Female', 'Other')),
  age int,
  date_of_birth date,
  blood_group text,
  address text,
  emergency_contact text,
  emergency_phone text,
  total_visits int default 0,
  last_visit_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_patients_phone on public.patients(phone);

-- 7. Appointments Table
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique, -- e.g. "APT-9482"
  patient_id uuid not null references public.patients(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  appointment_date date not null,
  time_slot text not null, -- e.g. "10:30 AM"
  slot_start_time timestamptz,
  consultation_fee numeric(10, 2) not null default 500.00,
  
  -- Lifecycle Status
  appointment_status text not null default 'Confirmed' 
    check (appointment_status in ('Pending', 'Confirmed', 'Checked In', 'In Consultation', 'Completed', 'Cancelled', 'No Show', 'Rescheduled')),
  
  -- Payment Status
  payment_status text not null default 'Pending'
    check (payment_status in ('Pending', 'Paid', 'Partially Paid', 'Refunded', 'Exempt')),
  
  payment_method text check (payment_method in ('Cash', 'UPI', 'Card', 'Online - Razorpay', 'Insurance')),
  
  checkin_time timestamptz,
  notes text,
  rescheduled_from_id uuid references public.appointments(id) on delete set null,
  reschedule_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_appointments_date on public.appointments(appointment_date);
create index if not exists idx_appointments_doctor on public.appointments(doctor_id, appointment_date);

-- 8. Inpatient Admissions & Discharges
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  admission_number text not null unique, -- e.g. "ADM-2026-081"
  patient_id uuid not null references public.patients(id) on delete cascade,
  attending_doctor_id uuid references public.doctors(id) on delete set null,
  department_name text not null,
  ward_or_room text not null, -- e.g. "ICU Bed 04", "Deluxe Ward 202"
  admission_date timestamptz not null default now(),
  expected_discharge_date timestamptz,
  actual_discharge_date timestamptz,
  admission_status text not null default 'Admitted' check (admission_status in ('Admitted', 'Discharged', 'Transferred')),
  discharge_notes text,
  created_at timestamptz default now()
);

-- 9. Payments & Reception Cash Desk
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique, -- e.g. "REC-8291"
  appointment_id uuid references public.appointments(id) on delete set null,
  patient_id uuid not null references public.patients(id) on delete cascade,
  amount numeric(10, 2) not null,
  payment_method text not null check (payment_method in ('Cash', 'UPI', 'Card', 'Online - Razorpay')),
  payment_status text not null default 'Completed' check (payment_status in ('Completed', 'Pending', 'Failed', 'Refunded')),
  transaction_ref text,
  collected_by text default 'Reception Desk',
  payment_date timestamptz not null default now(),
  created_at timestamptz default now()
);

-- 10. Website Inquiries
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_phone text not null,
  sender_email text,
  category text not null default 'General',
  message text not null,
  status text not null default 'New' check (status in ('New', 'Open', 'In Progress', 'Resolved', 'Closed')),
  assigned_to text,
  created_at timestamptz default now()
);

-- 11. Support Messages & Conversations
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  phone text not null,
  channel text not null default 'Portal',
  message text not null,
  is_incoming boolean not null default true,
  status text not null default 'Open' check (status in ('Open', 'Replied', 'Resolved')),
  created_at timestamptz default now()
);

-- 12. WhatsApp / SMS Communication Log
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_name text not null,
  phone_number text not null,
  template_type text not null, -- 'appointment_confirmation', 'reminder', 'doctor_reschedule', 'general'
  message_content text not null,
  delivery_status text not null default 'Queued' check (delivery_status in ('Queued', 'Sent', 'Delivered', 'Read', 'Failed')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- 13. Audit Logs (Mandatory for Operations & Governance)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_name text not null,
  actor_role text not null default 'receptionist',
  action text not null, -- 'RESCHEDULE_APPOINTMENT', 'MARK_DOCTOR_ABSENT', 'CANCEL_APPOINTMENT', 'COLLECT_PAYMENT'
  entity_type text not null,
  entity_id text,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.doctor_leaves enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.admissions enable row level security;
alter table public.payments enable row level security;
alter table public.inquiries enable row level security;
alter table public.support_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- Public can view doctors & departments for booking
create policy "Allow public read access to doctors" on public.doctors for select using (true);
create policy "Allow public read access to departments" on public.departments for select using (true);
create policy "Allow public insert into inquiries" on public.inquiries for insert with check (true);

-- Authenticated Receptionists & Staff have full operational access to daily workflows
create policy "Allow staff full access to appointments" on public.appointments for all to authenticated using (true);
create policy "Allow staff full access to patients" on public.patients for all to authenticated using (true);
create policy "Allow staff full access to doctor_leaves" on public.doctor_leaves for all to authenticated using (true);
create policy "Allow staff full access to admissions" on public.admissions for all to authenticated using (true);
create policy "Allow staff full access to payments" on public.payments for all to authenticated using (true);
create policy "Allow staff full access to inquiries" on public.inquiries for all to authenticated using (true);
create policy "Allow staff full access to notifications" on public.notifications for all to authenticated using (true);
create policy "Allow staff full access to audit_logs" on public.audit_logs for all to authenticated using (true);
