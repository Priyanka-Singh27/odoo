import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'booking.sqlite');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const globalForDb = globalThis as unknown as {
  db?: Database.Database;
};

export const db = globalForDb.db ?? new Database(dbPath);

function ensureColumn(table: string, column: string, definition: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

if (!globalForDb.db) {
  // db.pragma('journal_mode = WAL');  // Disabled for better real-time visibility in SQLite viewers
  db.pragma('foreign_keys = ON');

  db.exec(`
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

    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      specialty TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      organiser_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 1,
      location TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(organiser_id) REFERENCES users(id) ON DELETE CASCADE
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

    CREATE TABLE IF NOT EXISTS appointment_resources (
      appointment_id TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      PRIMARY KEY(appointment_id, resource_id),
      FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
      FOREIGN KEY(resource_id) REFERENCES resources(id) ON DELETE CASCADE
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

    CREATE TABLE IF NOT EXISTS resource_slots (
      id TEXT PRIMARY KEY,
      appointment_id TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      slot_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      capacity_total INTEGER NOT NULL DEFAULT 1,
      capacity_booked INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available','full','blocked')),
      FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
      FOREIGN KEY(resource_id) REFERENCES resources(id) ON DELETE CASCADE,
      UNIQUE(appointment_id, resource_id, slot_date, start_time)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      appointment_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      provider_id TEXT,
      resource_id TEXT,
      slot_id TEXT,
      resource_slot_id TEXT,
      slot_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      people_count INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL CHECK(status IN ('pending','confirmed','cancelled','reserved')),
      payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(payment_status IN ('unpaid','paid')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
      FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(provider_id) REFERENCES providers(id) ON DELETE SET NULL,
      FOREIGN KEY(resource_id) REFERENCES resources(id) ON DELETE SET NULL,
      FOREIGN KEY(slot_id) REFERENCES slots(id) ON DELETE SET NULL,
      FOREIGN KEY(resource_slot_id) REFERENCES resource_slots(id) ON DELETE SET NULL,
      CHECK ((provider_id IS NOT NULL AND slot_id IS NOT NULL) OR (resource_id IS NOT NULL AND resource_slot_id IS NOT NULL))
    );

    CREATE TABLE IF NOT EXISTS booking_answers (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      question_key TEXT NOT NULL,
      answer_value TEXT NOT NULL,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS appointment_questions (
      id TEXT PRIMARY KEY,
      appointment_id TEXT NOT NULL,
      text TEXT NOT NULL,
      type TEXT NOT NULL,
      required INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admin_audit (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(admin_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  ensureColumn('users', 'password_hash', 'TEXT');
  ensureColumn('users', 'is_verified', 'INTEGER NOT NULL DEFAULT 0');
  ensureColumn('users', 'otp_code', 'TEXT');
  ensureColumn('users', 'otp_expires_at', 'INTEGER');
  ensureColumn('users', 'otp_purpose', 'TEXT');
  ensureColumn('users', 'updated_at', "INTEGER NOT NULL DEFAULT (strftime(''s'',''now''))");
  ensureColumn('appointments', 'appointment_type', "TEXT DEFAULT 'user'");
  ensureColumn('appointments', 'share_token', 'TEXT');
  ensureColumn('bookings', 'resource_id', 'TEXT');
  ensureColumn('bookings', 'resource_slot_id', 'TEXT');

  const now = Math.floor(Date.now() / 1000);
  const adminPass = bcrypt.hashSync('Admin@12345', 12);
  const orgPass = bcrypt.hashSync('Organiser@12345', 12);
  const custPass = bcrypt.hashSync('Customer@12345', 12);

  db.prepare(`
    INSERT INTO users (id, full_name, email, role, is_active, password_hash, is_verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, ?, 1, ?, ?)
    ON CONFLICT(email) DO NOTHING
  `).run('usr_admin_1', 'Platform Admin', 'admin@booking.local', 'admin', adminPass, now, now);

  db.prepare(`
    INSERT INTO users (id, full_name, email, role, is_active, password_hash, is_verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, ?, 1, ?, ?)
    ON CONFLICT(email) DO NOTHING
  `).run('usr_org_1', 'Maya Organiser', 'organiser@booking.local', 'organiser', orgPass, now, now);

  db.prepare(`
    INSERT INTO users (id, full_name, email, role, is_active, password_hash, is_verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, ?, 1, ?, ?)
    ON CONFLICT(email) DO NOTHING
  `).run('usr_cust_1', 'Rahul Customer', 'customer@booking.local', 'customer', custPass, now, now);

  db.prepare(`
    INSERT INTO users (id, full_name, email, role, is_active, password_hash, is_verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, ?, 1, ?, ?)
    ON CONFLICT(email) DO NOTHING
  `).run('usr_doc_1', 'Dr. Amanda Clara', 'amanda@booking.local', 'provider', bcrypt.hashSync('Doctor@12345', 12), now, now);

  db.prepare(`
    INSERT INTO users (id, full_name, email, role, is_active, password_hash, is_verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, ?, 1, ?, ?)
    ON CONFLICT(email) DO NOTHING
  `).run('usr_doc_2', 'Dr. Esther Howard', 'esther@booking.local', 'provider', bcrypt.hashSync('Doctor@12345', 12), now, now);

  db.exec(`
    INSERT OR IGNORE INTO providers (id, user_id, specialty) VALUES
      ('prov_1', 'usr_doc_1', 'Psychology'),
      ('prov_2', 'usr_doc_2', 'Pediatrics');

    INSERT OR IGNORE INTO appointments (id, organiser_id, name, description, duration, provider_count, is_published, manage_capacity, max_bookings_per_slot, advance_payment, manual_confirmation) VALUES
      ('apt_psy_01', 'usr_org_1', 'Psychology Consultation', 'One-to-one consultation session', 30, 2, 1, 1, 5, 0, 0),
      ('apt_ped_01', 'usr_org_1', 'Pediatric Checkup', 'General child health checkup', 45, 1, 1, 0, 1, 0, 1);

    INSERT OR IGNORE INTO appointment_providers (appointment_id, provider_id) VALUES
      ('apt_psy_01', 'prov_1'),
      ('apt_psy_01', 'prov_2'),
      ('apt_ped_01', 'prov_2');

    INSERT OR IGNORE INTO slots (id, appointment_id, provider_id, slot_date, start_time, end_time, capacity_total, capacity_booked, status) VALUES
      ('slot_1', 'apt_psy_01', 'prov_1', '2026-05-03', '09:00', '09:30', 5, 1, 'available'),
      ('slot_2', 'apt_psy_01', 'prov_1', '2026-05-03', '09:30', '10:00', 5, 5, 'full'),
      ('slot_3', 'apt_psy_01', 'prov_2', '2026-05-03', '10:00', '10:30', 5, 2, 'available'),
      ('slot_4', 'apt_ped_01', 'prov_2', '2026-05-04', '11:00', '11:45', 1, 0, 'available');
  `);

  globalForDb.db = db;
}

export default db;
