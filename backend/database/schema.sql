-- ============================================================================
-- B2B Corporate Wellness Dashboard Database Schema
-- Local Sandbox: SQLite (PRAGMA foreign_keys = ON)
-- Portable Note: In PostgreSQL, AUTOINCREMENT -> SERIAL or IDENTITY, 
-- INTEGER for BOOLEAN -> BOOLEAN, DATETIME -> TIMESTAMP.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Employees Table (Extended for Authentication & Authorization)
-- PostgreSQL: employee_id VARCHAR(50) PRIMARY KEY, email VARCHAR(100) UNIQUE NOT NULL
CREATE TABLE IF NOT EXISTS employees (
    employee_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    password_hash TEXT,             -- Nullable for first-time password setup
    is_active INTEGER NOT NULL DEFAULT 1,
    password_created INTEGER NOT NULL DEFAULT 0,
    last_login DATETIME,
    reset_token TEXT,
    reset_token_expiry DATETIME
);

-- 2. Vendors Table
-- PostgreSQL: vendor_id SERIAL PRIMARY KEY
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    contact_email TEXT,
    location TEXT
);

-- 3. Wellness Services Table
-- PostgreSQL: service_id SERIAL PRIMARY KEY, vendor_id INTEGER REFERENCES vendors(vendor_id)
CREATE TABLE IF NOT EXISTS services (
    service_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- massage, organic_food, diet_planning, nutrition, thermal_spa, sauna, ayurvedic_doctor, on_premise_events, yoga
    description TEXT,
    duration_minutes INTEGER,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE SET NULL
);

-- 4. Employee Wellness Logs Table (14-day rolling window data)
-- PostgreSQL: log_id SERIAL PRIMARY KEY, healthy_food_logged BOOLEAN
CREATE TABLE IF NOT EXISTS employee_wellness_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    log_date DATE NOT NULL,
    sleep_hours REAL NOT NULL,
    hydration_glasses REAL NOT NULL,
    hydration_oz REAL NOT NULL,
    healthy_food_logged INTEGER NOT NULL DEFAULT 1,
    mood_score REAL NOT NULL,
    active_energy_kcal INTEGER DEFAULT 450,
    hrv_ms INTEGER DEFAULT 60,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- 5. Appointments Table (1:1 confirmed bookings)
-- PostgreSQL: appointment_id SERIAL PRIMARY KEY, appointment_date TIMESTAMP
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    service_id INTEGER NOT NULL,
    appointment_date DATETIME NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Booked', -- 'Booked', 'CONFIRMED', 'COMPLETED', 'CANCELLED'
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
);

-- 6. Events Table (Group workshops & retreats)
-- PostgreSQL: event_id SERIAL PRIMARY KEY, event_date TIMESTAMP
CREATE TABLE IF NOT EXISTS events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    event_title TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    location TEXT NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
);

-- 7. Event Registrations Table
-- PostgreSQL: registration_id SERIAL PRIMARY KEY
CREATE TABLE IF NOT EXISTS event_registrations (
    registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    event_id INTEGER NOT NULL,
    registration_status TEXT NOT NULL DEFAULT 'REGISTERED', -- 'REGISTERED', 'ATTENDED', 'MISSED'
    pass_code TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- 8. Service Usage Logs Table (90-day lookback summary)
-- PostgreSQL: usage_id SERIAL PRIMARY KEY
CREATE TABLE IF NOT EXISTS service_usage (
    usage_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    service_category TEXT NOT NULL,
    usage_date DATE NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Performance Indexes on employee_id, email, and dates for fast multi-tenant queries
CREATE INDEX IF NOT EXISTS idx_emp_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_logs_emp_date ON employee_wellness_logs(employee_id, log_date);
CREATE INDEX IF NOT EXISTS idx_appts_emp_date ON appointments(employee_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_regs_emp ON event_registrations(employee_id);
CREATE INDEX IF NOT EXISTS idx_usage_emp_date ON service_usage(employee_id, usage_date);
