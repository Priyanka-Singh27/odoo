PRAGMA foreign_keys = ON;

-- Core users and authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','organiser','admin','provider')),
  is_active INTEGER NOT NULL DEFAULT 1,
  password_hash TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  otp_code TEXT,
  otp_expires_at INTEGER,
  otp_purpose TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- Provider profile linked to a user
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  specialty TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointment templates created by organiser
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  organiser_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  provider_count INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  manage_capacity INTEGER NOT NULL DEFAULT 0,
  max_bookings_per_slot INTEGER NOT NULL DEFAULT 1,
  advance_payment INTEGER NOT NULL DEFAULT 0,
  manual_confirmation INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(organiser_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Many-to-many mapping between appointment and provider
CREATE TABLE IF NOT EXISTS appointment_providers (
  appointment_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  PRIMARY KEY(appointment_id, provider_id),
  FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY(provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Slot inventory per provider and appointment
CREATE TABLE IF NOT EXISTS slots (
  id TEXT PRIMARY KEY,
  appointment_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  slot_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  capacity_total INTEGER NOT NULL DEFAULT 1,
  capacity_booked INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available','full','blocked')),
  FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY(provider_id) REFERENCES providers(id) ON DELETE CASCADE,
  UNIQUE(appointment_id, provider_id, slot_date, start_time)
);

-- Customer bookings for slots
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  appointment_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  slot_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  people_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK(status IN ('pending','confirmed','cancelled','reserved')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid','paid')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(provider_id) REFERENCES providers(id) ON DELETE CASCADE,
  FOREIGN KEY(slot_id) REFERENCES slots(id) ON DELETE CASCADE
);

-- Dynamic form answers captured during booking
CREATE TABLE IF NOT EXISTS booking_answers (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  question_key TEXT NOT NULL,
  answer_value TEXT NOT NULL,
  FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active);
CREATE INDEX IF NOT EXISTS idx_users_otp_lookup ON users(email, otp_purpose, otp_expires_at);
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_organiser ON appointments(organiser_id);
CREATE INDEX IF NOT EXISTS idx_slots_lookup ON slots(appointment_id, provider_id, slot_date, start_time);
CREATE INDEX IF NOT EXISTS idx_slots_status ON slots(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_date ON bookings(provider_id, slot_date, start_time);
CREATE INDEX IF NOT EXISTS idx_booking_answers_booking ON booking_answers(booking_id);
