-- ==============================================================================
-- NAVJHAR SOCIETAL INNOVATION PORTAL (SIH-26043)
-- COMPREHENSIVE POSTGRESQL DATABASE SCHEMA (PRODUCTION / MVP)
-- Architecture: PostgreSQL + Firebase Storage + Spring Boot Backend
-- Generated: September 2026
-- Total Tables: 17 (13 Core Tables upgraded + 4 Critical Operational Tables)
-- ==============================================================================

-- Drop tables in reverse dependency order if recreating
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS problem_feedback CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS project_partnerships CASCADE;
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS problem_initiatives CASCADE;
DROP TABLE IF EXISTS problem_media CASCADE;
DROP TABLE IF EXISTS problems CASCADE;
DROP TABLE IF EXISTS problem_categories CASCADE;
DROP TABLE IF EXISTS universities CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS local_organizations CASCADE;
DROP TABLE IF EXISTS panchayats CASCADE;
DROP TABLE IF EXISTS citizens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS languages CASCADE;

-- ==============================================================================
-- 1. LANGUAGES
-- Supports 8 official regional and state languages used across Jharkhand
-- ==============================================================================
CREATE TABLE languages (
    language_id     BIGSERIAL PRIMARY KEY,
    language_name   VARCHAR(50) NOT NULL,
    language_code   VARCHAR(10) NOT NULL UNIQUE
);

-- Pre-seed regional languages
INSERT INTO languages (language_name, language_code) VALUES
('Hindi', 'hi'),
('English', 'en'),
('Santhali', 'sat'),
('Mundari', 'unr'),
('Ho', 'hoc'),
('Kurukh', 'kru'),
('Khortha', 'kht'),
('Nagpuri', 'sck');

-- ==============================================================================
-- 2. USERS
-- Central identity table for both Victims (Citizen, Panchayat, Local Org)
-- and Solvers (University, Industry, Organization)
-- ==============================================================================
CREATE TABLE users (
    user_id         BIGSERIAL PRIMARY KEY,
    user_type       VARCHAR(20) NOT NULL CHECK (user_type IN ('VICTIM', 'SOLVER')),
    sub_type        VARCHAR(30) NOT NULL CHECK (sub_type IN ('CITIZEN', 'PANCHAYAT', 'LOCAL_ORG', 'ORGANIZATION', 'INDUSTRY', 'UNIVERSITY')),
    language_id     BIGINT REFERENCES languages(language_id),
    phone_number    VARCHAR(15) UNIQUE,                  -- Login identifier for Mobile OTP flow
    email           VARCHAR(255) UNIQUE,                 -- Login identifier for Corporate / Institutional email flow
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,      -- Verification status via OTP / Verification Code
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type, sub_type);

-- ==============================================================================
-- 3. CITIZENS (Victim Profile)
-- Individual citizens reporting societal challenges
-- ==============================================================================
CREATE TABLE citizens (
    citizen_id          BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    name                VARCHAR(150) NOT NULL,
    gender              VARCHAR(30) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    date_of_birth       DATE,
    house_number        VARCHAR(100),                    -- Structured address from frontend
    city_village        VARCHAR(150),
    pincode             VARCHAR(10),
    landmark            VARCHAR(150),
    district            VARCHAR(100),
    residential_address TEXT,                            -- Formatted full address
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_citizens_district ON citizens(district);
CREATE INDEX idx_citizens_pincode ON citizens(pincode);

-- ==============================================================================
-- 4. PANCHAYATS (Victim Profile)
-- Gram Panchayat / Mukhiya representation
-- ==============================================================================
CREATE TABLE panchayats (
    panchayat_id            BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    panchayat_name          VARCHAR(150) NOT NULL,       -- e.g., Piska Nagri Panchayat
    sarpanch_mukhiya_name   VARCHAR(150) NOT NULL,       -- e.g., Ramesh Mahto
    district                VARCHAR(100) NOT NULL,       -- e.g., Ranchi
    block                   VARCHAR(100) NOT NULL,       -- e.g., Kanke
    villages_covered        TEXT,                        -- Comma-separated or list of villages in jurisdiction
    office_address          TEXT NOT NULL,
    official_phone          VARCHAR(20),
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_panchayats_dist_block ON panchayats(district, block);

-- ==============================================================================
-- 5. LOCAL ORGANIZATIONS (Victim Profile)
-- Resident Welfare Associations (RWA), CBOs, Village committees
-- ==============================================================================
CREATE TABLE local_organizations (
    local_org_id            BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    organization_name       VARCHAR(200) NOT NULL,       -- e.g., Kanke Jan Sewa Samiti
    spoc_name               VARCHAR(150) NOT NULL,       -- Single Point of Contact (President / Secretary)
    designation             VARCHAR(100) NOT NULL,
    district                VARCHAR(100) NOT NULL,
    block                   VARCHAR(100) NOT NULL,
    panchayat_area          VARCHAR(150) NOT NULL,       -- Neighborhood / Panchayat jurisdiction
    office_address          TEXT NOT NULL,
    organization_contact    VARCHAR(20) NOT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_local_org_dist_block ON local_organizations(district, block);

-- ==============================================================================
-- 6. ORGANIZATIONS (Solver Profile)
-- Registered NGOs, Non-profits, Research Foundations
-- ==============================================================================
CREATE TABLE organizations (
    organization_id         BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    organization_name       VARCHAR(200) NOT NULL,
    registration_number     VARCHAR(100),                -- e.g., NGO Darpan ID / Trust Registration No.
    spoc_name               VARCHAR(150) NOT NULL,       -- Single Point of Contact
    spoc_contact            VARCHAR(30) NOT NULL,
    domain                  VARCHAR(100) NOT NULL,       -- Education, Healthcare, Water, Rural Dev
    domain_expertise        TEXT,                        -- Community Mobilisation, Field Implementation
    registered_address      TEXT NOT NULL,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. INDUSTRIES (Solver Profile)
-- Corporate partners, MSMEs, Technology companies (CSR / Innovation)
-- ==============================================================================
CREATE TABLE industries (
    industry_id             BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    industry_name           VARCHAR(200) NOT NULL,       -- e.g., TechGrow Solutions Pvt. Ltd.
    industry_type           VARCHAR(100) NOT NULL,       -- Category: IoT, AgriTech, Manufacturing, Construction
    spoc_name               VARCHAR(150) NOT NULL,       -- Single Point of Contact
    designation             VARCHAR(100),
    official_email          VARCHAR(255) NOT NULL,       -- Corporate email used for authentication
    phone_number            VARCHAR(20),
    domain_expertise        TEXT NOT NULL,               -- IoT Hardware, Water Technology, Embedded Systems
    company_address         TEXT NOT NULL,
    csr_budget_available    NUMERIC(14,2),               -- Optional annual CSR allocation for projects
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_industries_email ON industries(official_email);

-- ==============================================================================
-- 8. UNIVERSITIES (Solver Profile)
-- Academic institutions, Engineering Colleges, R&D Labs
-- ==============================================================================
CREATE TABLE universities (
    university_id           BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    university_name         VARCHAR(250) NOT NULL,       -- e.g., BIT Mesra, NIT Jamshedpur, IIT ISM
    aishe_code              VARCHAR(50),                 -- All India Survey on Higher Education Code
    spoc_name               VARCHAR(150) NOT NULL,       -- Dean of R&D / Department Head
    spoc_number             VARCHAR(30) NOT NULL,
    official_email          VARCHAR(255),
    institutional_address   TEXT NOT NULL,
    domain_expertise        TEXT NOT NULL,               -- Civil Eng, IoT, Water Management, Agronomy
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 9. PROBLEM CATEGORIES
-- Categorization of societal challenges
-- ==============================================================================
CREATE TABLE problem_categories (
    category_id     BIGSERIAL PRIMARY KEY,
    category_name   VARCHAR(100) NOT NULL UNIQUE,
    icon_key        VARCHAR(50),                         -- Icon identifier for frontend rendering
    description     TEXT
);

-- Pre-seed problem categories matching the frontend
INSERT INTO problem_categories (category_name, icon_key, description) VALUES
('Agriculture', 'Wheat', 'Irrigation canals, farm equipment, seeds, post-harvest technology'),
('Water', 'Droplets', 'Handpumps, tube-wells, water contamination, pipeline leakage'),
('Healthcare', 'Stethoscope', 'Primary health centres, medical logistics, sanitation diseases'),
('Education', 'School', 'School infrastructure, digital classrooms, lab equipment'),
('Roads', 'Navigation', 'Potholes, broken bridges, rural connectivity roads'),
('Sanitation', 'Trash2', 'Waste collection, open drainage, public toilets'),
('Environment', 'Leaf', 'Forest conservation, mine dust pollution, soil erosion'),
('Electricity', 'Zap', 'Streetlights, transformer breakdown, rural grid connectivity'),
('Public Services', 'Building', 'PDS ration issues, community hall repair, civic services'),
('Other', 'Layers', 'General societal and community challenges');

-- ==============================================================================
-- 10. PROBLEMS
-- Central repository of citizen, panchayat, and community challenges
-- ==============================================================================
CREATE TABLE problems (
    problem_id              BIGSERIAL PRIMARY KEY,
    problem_code            VARCHAR(50) NOT NULL UNIQUE, -- Human-readable identifier e.g. JH-WTR-1024
    submitted_by            BIGINT NOT NULL REFERENCES users(user_id),
    category_id             BIGINT NOT NULL REFERENCES problem_categories(category_id),
    title                   VARCHAR(250) NOT NULL,
    description             TEXT NOT NULL,
    
    -- Spatial & Geolocation Coordinates (Crucial for Map Pins & Proximity Filter)
    latitude                NUMERIC(10,8),               -- e.g., 23.34410000 (GPS auto-detection)
    longitude               NUMERIC(11,8),               -- e.g., 85.30960000 (GPS auto-detection)
    
    -- Administrative Hierarchy
    district                VARCHAR(100) NOT NULL,       -- e.g., Ranchi
    block                   VARCHAR(100) NOT NULL,       -- e.g., Kanke
    panchayat_ward          VARCHAR(150),                -- e.g., Piska Nagri / Ward 3
    landmark                VARCHAR(150),                -- e.g., Near Bakri Bazar
    site_address            TEXT NOT NULL,               -- Full formatted location string
    
    -- On-Behalf Reporting details
    reported_for            VARCHAR(30) DEFAULT 'Myself' CHECK (reported_for IN ('Myself', 'Another Person', 'Community', 'Panchayat / Local Body')),
    beneficiary_name        VARCHAR(150),                -- Populated if reported for someone else
    beneficiary_phone       VARCHAR(20),
    is_anonymous            BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- AI Analysis & Severity Attributes
    priority_score          INT DEFAULT 50 CHECK (priority_score BETWEEN 0 AND 100),
    severity                VARCHAR(20) DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    ai_category_detected    VARCHAR(100),
    ai_confidence           VARCHAR(20),                 -- e.g., '94%'
    is_duplicate            BOOLEAN NOT NULL DEFAULT FALSE,
    duplicate_of_id         BIGINT REFERENCES problems(problem_id),
    
    -- Operational Status Lifecycle
    status                  VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' 
                            CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'SOLVED')),
    
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_problems_code ON problems(problem_code);
CREATE INDEX idx_problems_status ON problems(status);
CREATE INDEX idx_problems_category ON problems(category_id);
CREATE INDEX idx_problems_location ON problems(district, block);
CREATE INDEX idx_problems_coords ON problems(latitude, longitude);

-- ==============================================================================
-- 11. PROBLEM MEDIA (Firebase Storage Reference)
-- Binary files (Photos, Videos, Audio Voice Notes) stored in Firebase Storage;
-- Metadata and URLs stored here in PostgreSQL.
-- ==============================================================================
CREATE TABLE problem_media (
    media_id        BIGSERIAL PRIMARY KEY,
    problem_id      BIGINT NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
    media_type      VARCHAR(20) NOT NULL CHECK (media_type IN ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO')),
    file_url        TEXT NOT NULL,                       -- Firebase Storage Download URL
    storage_path    TEXT NOT NULL,                       -- problems/{problemId}/images/file.jpg
    file_name       VARCHAR(255) NOT NULL,               -- Original or display file name
    mime_type       VARCHAR(100) NOT NULL,               -- e.g., image/jpeg, audio/webm, video/mp4
    file_size       BIGINT,                              -- File size in bytes
    duration_seconds INT,                                -- Duration for voice audio notes
    uploaded_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_problem_media_problem ON problem_media(problem_id);
CREATE INDEX idx_problem_media_type ON problem_media(media_type);

-- ==============================================================================
-- 12. PROBLEM INITIATIVES (Solver Proposals & Projects)
-- University or Solver proposals to tackle a verified challenge
-- ==============================================================================
CREATE TABLE problem_initiatives (
    initiative_id           BIGSERIAL PRIMARY KEY,
    problem_id              BIGINT NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
    solver_user_id          BIGINT NOT NULL REFERENCES users(user_id),
    initiative_title        VARCHAR(250) NOT NULL,
    
    -- Proposal Breakdown from ProposalScreen
    problem_understanding   TEXT,                        -- Context & root cause analysis
    proposed_solution       TEXT NOT NULL,               -- Detailed solution architecture
    technology_approach     TEXT,                        -- Technologies, hardware, algorithms used
    expected_impact         TEXT,                        -- Beneficiaries impacted, quantifiable improvement
    
    -- Budget & Timeline
    estimated_budget        NUMERIC(12,2),               -- e.g., ₹4,50,000
    timeline_months         INT,                         -- e.g., 3, 6, or 12 months
    timeline_display        VARCHAR(100),                -- e.g., '3 months (Sep–Nov 2026)'
    
    -- Academic Team Details
    faculty_guide_name      VARCHAR(150),
    faculty_guide_email     VARCHAR(255),
    team_leader_name        VARCHAR(150),
    
    status                  VARCHAR(30) NOT NULL DEFAULT 'PROPOSED'
                            CHECK (status IN ('PROPOSED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')),
    
    started_at              TIMESTAMP,
    completed_at            TIMESTAMP,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_initiatives_problem ON problem_initiatives(problem_id);
CREATE INDEX idx_initiatives_solver ON problem_initiatives(solver_user_id);
CREATE INDEX idx_initiatives_status ON problem_initiatives(status);

-- ==============================================================================
-- 13. PROJECT PARTNERSHIPS (Industry Collaboration)
-- Connects Industry solvers to University proposals with funding/equipment
-- ==============================================================================
CREATE TABLE project_partnerships (
    partnership_id          BIGSERIAL PRIMARY KEY,
    initiative_id           BIGINT NOT NULL REFERENCES problem_initiatives(initiative_id) ON DELETE CASCADE,
    industry_user_id        BIGINT NOT NULL REFERENCES users(user_id),
    
    -- Support types offered (Mentorship, Funding, Hardware, Infrastructure, Field Testing)
    support_types           TEXT NOT NULL,               -- Comma-separated or JSON list
    budget_offered          NUMERIC(12,2),               -- e.g., ₹1,50,000
    mentor_hours_per_week   VARCHAR(50),                 -- e.g., '10 hrs/week'
    contact_person          VARCHAR(150) NOT NULL,
    contact_email           VARCHAR(255) NOT NULL,
    notes                   TEXT,
    
    status                  VARCHAR(30) NOT NULL DEFAULT 'OFFERED'
                            CHECK (status IN ('OFFERED', 'CONFIRMED', 'REJECTED', 'COMPLETED')),
    
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partnerships_initiative ON project_partnerships(initiative_id);
CREATE INDEX idx_partnerships_industry ON project_partnerships(industry_user_id);

-- ==============================================================================
-- 14. PROJECT MILESTONES (Lifecycle & Health Tracking)
-- Tracks Phase 1, Phase 2, Phase 3 deliverables and execution schedule
-- ==============================================================================
CREATE TABLE project_milestones (
    milestone_id            BIGSERIAL PRIMARY KEY,
    initiative_id           BIGINT NOT NULL REFERENCES problem_initiatives(initiative_id) ON DELETE CASCADE,
    phase_order             INT NOT NULL DEFAULT 1,      -- 1, 2, 3...
    phase_title             VARCHAR(150) NOT NULL,       -- e.g., 'Phase 1: Field Assessment'
    description             TEXT,                        -- e.g., 'Identify canal breach points and survey flow'
    deliverables            TEXT,                        -- Specific deliverables expected
    target_date             DATE,
    completed_date          DATE,
    progress_percentage     INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    status                  VARCHAR(30) NOT NULL DEFAULT 'PENDING'
                            CHECK (status IN ('PENDING', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'DELAYED')),
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_milestones_initiative ON project_milestones(initiative_id);

-- ==============================================================================
-- 15. PROBLEM FEEDBACK (Citizen Satisfaction & Review)
-- 1-5 Star rating and comments from citizens once a problem is resolved
-- ==============================================================================
CREATE TABLE problem_feedback (
    feedback_id         BIGSERIAL PRIMARY KEY,
    problem_id          BIGINT NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
    user_id             BIGINT NOT NULL REFERENCES users(user_id),
    rating              INT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- 1 to 5 Stars
    comments            TEXT,                                        -- Qualitative user feedback
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_problem ON problem_feedback(problem_id);

-- ==============================================================================
-- 16. NOTIFICATIONS (In-App Dashboard Alerts)
-- Powers the real-time notification bell across all dashboards
-- ==============================================================================
CREATE TABLE notifications (
    notification_id     BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title               VARCHAR(200) NOT NULL,
    message             TEXT NOT NULL,
    target_screen       VARCHAR(50),                     -- Navigation route e.g., 'tracking', 'project-lifecycle'
    reference_id        VARCHAR(50),                     -- e.g., 'JH-WTR-1024'
    is_read             BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifs_user ON notifications(user_id, is_read);

-- ==============================================================================
-- 17. OTP VERIFICATIONS
-- Stores hashed OTPs for phone or email verification prior to or during login
-- ==============================================================================
CREATE TABLE otp_verifications (
    otp_id          BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(user_id) ON DELETE CASCADE, -- NULL during pre-registration
    destination     VARCHAR(150) NOT NULL,               -- Phone Number or Corporate Email
    otp_hash        TEXT NOT NULL,                       -- Hashed OTP (bcrypt/SHA256), never plain text
    expires_at      TIMESTAMP NOT NULL,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_destination ON otp_verifications(destination);
CREATE INDEX idx_otp_expiry ON otp_verifications(expires_at);

-- ==============================================================================
-- VERIFICATION QUERY
-- Displays list of all created tables and their purpose
-- ==============================================================================
SELECT 
    table_name 
FROM 
    information_schema.tables 
WHERE 
    table_schema = 'public' 
ORDER BY 
    table_name;
