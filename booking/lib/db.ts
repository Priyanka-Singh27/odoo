import Database from 'better-sqlite3';
import path from 'path';

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "booking.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const globalForDb = globalThis as unknown as {
  db?: Database.Database;
};

export const db = globalForDb.db ?? new Database(dbPath);

if (!globalForDb.db) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK(role IN ('customer','organiser','admin','provider')),
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      specialty TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

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

    CREATE TABLE IF NOT EXISTS appointment_providers (
      appointment_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      PRIMARY KEY(appointment_id, provider_id),
      FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
      FOREIGN KEY(provider_id) REFERENCES providers(id) ON DELETE CASCADE
    );

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

    CREATE TABLE IF NOT EXISTS booking_answers (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      question_key TEXT NOT NULL,
      answer_value TEXT NOT NULL,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );
  `);

  const count = db.prepare("SELECT COUNT(*) as total FROM appointments").get() as { total: number };
  if (count.total === 0) {
    db.exec(`
      INSERT INTO users (id, full_name, email, role) VALUES
        ('usr_org_1', 'Maya Organiser', 'organiser@example.com', 'organiser'),
        ('usr_cust_1', 'Rahul Customer', 'customer@example.com', 'customer'),
        ('usr_doc_1', 'Dr. Amanda Clara', 'amanda@example.com', 'provider'),
        ('usr_doc_2', 'Dr. Esther Howard', 'esther@example.com', 'provider');

      INSERT INTO providers (id, user_id, specialty) VALUES
        ('prov_1', 'usr_doc_1', 'Psychology'),
        ('prov_2', 'usr_doc_2', 'Pediatrics');

      INSERT INTO appointments (id, organiser_id, name, description, duration, provider_count, is_published, manage_capacity, max_bookings_per_slot, advance_payment, manual_confirmation) VALUES
        ('apt_psy_01', 'usr_org_1', 'Psychology Consultation', 'One-to-one consultation session', 30, 2, 1, 1, 5, 0, 0),
        ('apt_ped_01', 'usr_org_1', 'Pediatric Checkup', 'General child health checkup', 45, 1, 1, 0, 1, 0, 1);

      INSERT INTO appointment_providers (appointment_id, provider_id) VALUES
        ('apt_psy_01', 'prov_1'),
        ('apt_psy_01', 'prov_2'),
        ('apt_ped_01', 'prov_2');

      INSERT INTO slots (id, appointment_id, provider_id, slot_date, start_time, end_time, capacity_total, capacity_booked, status) VALUES
        ('slot_1', 'apt_psy_01', 'prov_1', '2026-05-03', '09:00', '09:30', 5, 1, 'available'),
        ('slot_2', 'apt_psy_01', 'prov_1', '2026-05-03', '09:30', '10:00', 5, 5, 'full'),
        ('slot_3', 'apt_psy_01', 'prov_2', '2026-05-03', '10:00', '10:30', 5, 2, 'available'),
        ('slot_4', 'apt_ped_01', 'prov_2', '2026-05-04', '11:00', '11:45', 1, 0, 'available');
    `);
  }

  globalForDb.db = db;
}
