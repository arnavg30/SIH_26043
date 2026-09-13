const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Pool } = require("pg");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
const localUploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(localUploadDir));

// ---------------- Firebase Admin ----------------
if (!getApps().length) {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json");
  initializeApp({ credential: cert(serviceAccount) });
}
const firebaseAuth = getAuth();

// ==================== OCI Object Storage ====================
const common = require("oci-common");
const objectstorage = require("oci-objectstorage");
const OCI_CONFIG_FILE = "C:\\Users\\arnav\\.oci\\config.txt";
let namespaceName = process.env.OCI_NAMESPACE;
const bucketName = process.env.OCI_BUCKET_NAME;
let objectStorageClient;

function getOCIClient() {
  if (objectStorageClient) return objectStorageClient;
  if (!bucketName) throw new Error("OCI_BUCKET_NAME is not configured");

  const ociProvider = new common.ConfigFileAuthenticationDetailsProvider(
    OCI_CONFIG_FILE,
    "DEFAULT"
  );

  objectStorageClient = new objectstorage.ObjectStorageClient({
    authenticationDetailsProvider: ociProvider,
  });
  return objectStorageClient;
}

async function uploadToOCI(file, objectName) {
  const client = getOCIClient();

  if (!namespaceName) {
    const namespaceResponse = await client.getNamespace({});
    namespaceName = namespaceResponse.value;
  }

  await client.putObject({
    namespaceName,
    bucketName,
    objectName,
    putObjectBody: file.buffer,
    contentType: file.mimetype,
  });

  return objectName;
}

async function saveMediaLocally(file, objectName) {
  const safeName = objectName.replace(/[^a-zA-Z0-9._-]/g, "_");
  await fs.promises.mkdir(localUploadDir, { recursive: true });
  await fs.promises.writeFile(path.join(localUploadDir, safeName), file.buffer);
  return { storagePath: safeName, fileUrl: `/uploads/${safeName}` };
}

// ---------------- PostgreSQL ----------------
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// pool.query("SELECT NOW()")
//   .then(() => console.log("PostgreSQL connected!"))
//   .catch((err) => console.error("PostgreSQL connection failed:", err.message));

// ---------------- Helpers ----------------
function clean(value) {
  return typeof value === "string" ? value.trim() : value;
}

async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Firebase ID token provided" });
    }
    const token = header.slice(7);
    req.user = await firebaseAuth.verifyIdToken(token);
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
}

async function getDbUser(firebaseUid) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE firebase_uid = $1 LIMIT 1`,
    [firebaseUid]
  );
  return rows[0] || null;
}

function makeProblemCode(categoryName) {
  const prefix = String(categoryName || "OTHER")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, "X");
  return `JH-${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

// ---------------- Public ----------------
app.get("/", (req, res) => {
  res.json({ message: "SIH Backend is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected" });
  } catch (err) {
    res.status(503).json({ ok: false, database: "unavailable" });
  }
});

// ---------------- Authentication / user sync ----------------
// Firebase remains the source of authentication. PostgreSQL stores application identity/profile.

app.post("/api/auth/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const existing = await pool.query("SELECT sub_type FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        exists: true, 
        role: existing.rows[0].sub_type,
        message: `Yeh email pehle se '${existing.rows[0].sub_type}' ke roop mein registered hai. Ek email sirf ek role ke liye use ho sakta hai.` 
      });
    }
    res.json({ exists: false });
  } catch(err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/sync", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { profileType = "CITIZEN", languageCode = "en" } = req.body || {};
    const allowed = new Set(["CITIZEN", "PANCHAYAT", "LOCAL_ORG", "ORGANIZATION", "INDUSTRY", "UNIVERSITY"]);
    const subType = String(profileType).toUpperCase();
    if (!allowed.has(subType)) return res.status(400).json({ message: "Invalid profile type" });

    const userType = ["CITIZEN", "PANCHAYAT", "LOCAL_ORG"].includes(subType) ? "VICTIM" : "SOLVER";
    const phone = req.user.phone_number || null;
    const email = req.user.email || null;

    await client.query("BEGIN");

    const langResult = await client.query(
      `SELECT language_id FROM languages WHERE language_code = $1 LIMIT 1`,
      [languageCode]
    );
    const languageId = langResult.rows[0]?.language_id || null;

    const existing = await client.query(
      `SELECT user_id, user_type, sub_type FROM users WHERE firebase_uid = $1 LIMIT 1`,
      [req.user.uid]
    );

    let row;
    if (existing.rows[0]) {
      // --- ENFORCE ROLE CONSISTENCY CONSTRAINT ---
      if (existing.rows[0].sub_type !== subType) {
        await client.query("ROLLBACK");
        return res.status(403).json({ message: `This email is already registered as a ${existing.rows[0].sub_type}. You cannot switch roles.` });
      }

      const result = await client.query(
        `UPDATE users
         SET phone_number = COALESCE($2, phone_number),
             email = COALESCE($3, email),
             language_id = COALESCE($4, language_id),
             is_verified = TRUE,
             updated_at = CURRENT_TIMESTAMP
         WHERE firebase_uid = $1
         RETURNING user_id, user_type, sub_type, phone_number, email, language_id, is_verified`,
        [req.user.uid, phone, email, languageId]
      );
      row = result.rows[0];
    } else {
      // --- ENFORCE EMAIL DOMAIN CONSTRAINT (ONLY FOR NEW REGISTRATIONS) ---
      if (subType === 'UNIVERSITY') {
        if (!email || (!email.endsWith('.edu') && !email.endsWith('.ac.in') && !email.endsWith('.edu.in'))) {
          await client.query("ROLLBACK");
          return res.status(403).json({ message: "University accounts must use a valid institutional email (.edu or .ac.in)." });
        }
      } else {
        if (email && (email.endsWith('.edu') || email.endsWith('.ac.in') || email.endsWith('.edu.in'))) {
          await client.query("ROLLBACK");
          return res.status(403).json({ message: "Institutional emails (.edu or .ac.in) are strictly reserved for University accounts." });
        }
      }

      const result = await client.query(
        `INSERT INTO users
          (firebase_uid, user_type, sub_type, language_id, phone_number, email, is_verified)
         VALUES ($1,$2,$3,$4,$5,$6,TRUE)
         RETURNING user_id, user_type, sub_type, phone_number, email, language_id, is_verified`,
        [req.user.uid, userType, subType, languageId, phone, email]
      );
      row = result.rows[0];
    }

    await client.query("COMMIT");
    res.json({ user: row, firebaseUid: req.user.uid });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("/api/auth/sync:", err);
    res.status(500).json({ message: "Could not sync Firebase user", error: err.message });
  } finally {
    client.release();
  }
});

// ---------------- Profile ----------------
app.get("/api/profile/me", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User profile not found. Call /api/auth/sync first." });

    let profile = null;
    if (user.sub_type === "CITIZEN") {
      const r = await pool.query(`SELECT * FROM citizens WHERE user_id = $1`, [user.user_id]);
      profile = r.rows[0] || null;
    } else if (user.sub_type === "PANCHAYAT") {
      const r = await pool.query(`SELECT * FROM panchayats WHERE user_id = $1`, [user.user_id]);
      profile = r.rows[0] || null;
    } else if (user.sub_type === "LOCAL_ORG") {
      const r = await pool.query(`SELECT * FROM local_organizations WHERE user_id = $1`, [user.user_id]);
      profile = r.rows[0] || null;
    } else if (user.sub_type === "ORGANIZATION") {
      const r = await pool.query(`SELECT * FROM organizations WHERE user_id = $1`, [user.user_id]);
      profile = r.rows[0] || null;
    } else if (user.sub_type === "INDUSTRY") {
      const r = await pool.query(`SELECT * FROM industries WHERE user_id = $1`, [user.user_id]);
      profile = r.rows[0] || null;
    } else if (user.sub_type === "UNIVERSITY") {
      const r = await pool.query(`SELECT * FROM universities WHERE user_id = $1`, [user.user_id]);
      profile = r.rows[0] || null;
    }

    res.json({ user, profile });
  } catch (err) {
    console.error("/api/profile/me:", err);
    res.status(500).json({ message: "Could not load profile" });
  }
});

app.put("/api/profile/citizen", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    if (user.sub_type !== "CITIZEN") return res.status(403).json({ message: "Citizen profile required" });

    const {
      name, phoneNumber, gender, dateOfBirth, houseNumber, cityVillage,
      pincode, landmark, district, residentialAddress,
    } = req.body || {};

        if (!clean(name)) return res.status(400).json({ message: "Name is required" });
    if (!/^\d{10}$/.test(String(phoneNumber || "").replace(/\D/g, ""))) return res.status(400).json({ message: "A valid 10-digit mobile number is required" });
    if (!clean(gender)) return res.status(400).json({ message: "Gender is required" });
    if (!dateOfBirth || !String(dateOfBirth).trim()) return res.status(400).json({ message: "Date of birth is required" });

    await client.query("BEGIN");
    await client.query(`UPDATE users SET phone_number = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`, [String(phoneNumber).replace(/\D/g, ""), user.user_id]);
    const result = await client.query(
      `INSERT INTO citizens
        (user_id, name, gender, date_of_birth, house_number, city_village, pincode, landmark, district, residential_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (user_id) DO UPDATE SET
        name=EXCLUDED.name, gender=EXCLUDED.gender, date_of_birth=EXCLUDED.date_of_birth,
        house_number=EXCLUDED.house_number, city_village=EXCLUDED.city_village,
        pincode=EXCLUDED.pincode, landmark=EXCLUDED.landmark, district=EXCLUDED.district,
        residential_address=EXCLUDED.residential_address, updated_at=CURRENT_TIMESTAMP
       RETURNING *`,
      [user.user_id, clean(name), clean(gender) || null, dateOfBirth || null, clean(houseNumber) || null,
       clean(cityVillage) || null, clean(pincode) || null, clean(landmark) || null,
       clean(district) || null, clean(residentialAddress) || null]
    );
    await client.query("COMMIT");
    res.json({ profile: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("/api/profile/citizen:", err);
    res.status(500).json({ message: "Could not save citizen profile", error: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/profile/panchayat", verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const user = await getDbUser(req.user.uid);

    if (!user) {
      return res.status(404).json({ message: "User not synced" });
    }

    if (user.sub_type !== "PANCHAYAT") {
      return res.status(403).json({ message: "Panchayat profile required" });
    }

    const {
      panchayatName,
      sarpanchName,
      district,
      block,
      villagesCovered,
      officeAddress,
      officialPhone,
    } = req.body || {};

    if (!clean(panchayatName)) {
      return res.status(400).json({ message: "Panchayat name is required" });
    }

    if (!clean(sarpanchName)) {
      return res.status(400).json({ message: "Sarpanch / Mukhiya name is required" });
    }

    if (!clean(district)) {
      return res.status(400).json({ message: "District is required" });
    }

    if (!clean(block)) {
      return res.status(400).json({ message: "Block is required" });
    }

    if (!clean(officeAddress)) {
      return res.status(400).json({ message: "Office address is required" });
    }

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO panchayats
        (
          user_id,
          panchayat_name,
          sarpanch_mukhiya_name,
          district,
          block,
          villages_covered,
          office_address,
          official_phone
        )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (user_id) DO UPDATE SET
        panchayat_name = EXCLUDED.panchayat_name,
        sarpanch_mukhiya_name = EXCLUDED.sarpanch_mukhiya_name,
        district = EXCLUDED.district,
        block = EXCLUDED.block,
        villages_covered = EXCLUDED.villages_covered,
        office_address = EXCLUDED.office_address,
        official_phone = EXCLUDED.official_phone,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        user.user_id,
        clean(panchayatName),
        clean(sarpanchName),
        clean(district),
        clean(block),
        clean(villagesCovered) || null,
        clean(officeAddress),
        clean(officialPhone) || null,
      ]
    );

    await client.query("COMMIT");

    res.json({
      message: "Panchayat profile saved",
      profile: result.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("/api/profile/panchayat:", err);

    res.status(500).json({
      message: "Could not save Panchayat profile",
      error: err.message,
    });
  } finally {
    client.release();
  }
});

app.put("/api/profile/localorg", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    if (user.sub_type !== "LOCAL_ORG") return res.status(403).json({ message: "Local Org profile required" });

    const {
      organizationName, spocName, designation = "Representative",
      district, block, panchayatArea, officeAddress, organizationContact, domainExpertise
    } = req.body || {};

    if (!clean(organizationName)) return res.status(400).json({ message: "Organization name is required" });
    if (!clean(spocName)) return res.status(400).json({ message: "SPOC name is required" });
    if (!clean(officeAddress)) return res.status(400).json({ message: "Office address is required" });

    let aiExpertise = domainExpertise;
    if (domainExpertise) {
      try {
        const fetch = require('node-fetch');
        const aiRes = await fetch('http://127.0.0.1:8000/categorize-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: domainExpertise })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.expertise && Array.isArray(aiData.expertise)) {
          aiExpertise = aiData.expertise.join(', ');
        }
      } catch (e) {
        console.error('AI Profile categorization failed:', e);
      }
    }

    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO local_organizations
        (user_id, organization_name, spoc_name, designation, district, block, panchayat_area, office_address, organization_contact, domain_expertise)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (user_id) DO UPDATE SET
        organization_name = EXCLUDED.organization_name,
        spoc_name = EXCLUDED.spoc_name,
        designation = EXCLUDED.designation,
        district = EXCLUDED.district,
        block = EXCLUDED.block,
        panchayat_area = EXCLUDED.panchayat_area,
        office_address = EXCLUDED.office_address,
        organization_contact = EXCLUDED.organization_contact,
        domain_expertise = EXCLUDED.domain_expertise,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        user.user_id, clean(organizationName), clean(spocName), clean(designation),
        clean(district) || null, clean(block) || null, clean(panchayatArea) || null,
        clean(officeAddress), clean(organizationContact) || null, aiExpertise || null
      ]
    );
    await client.query("COMMIT");
    res.json({ message: "Local organization profile saved", profile: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("/api/profile/localorg:", err);
    res.status(500).json({ message: "Could not save local organization profile", error: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/profile/organization", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    if (user.sub_type !== "ORGANIZATION") return res.status(403).json({ message: "Organization profile required" });

    const {
      organizationName, registrationNumber, spocName, spocContact,
      domain = "Societal Innovation", domainExpertise, registeredAddress,
    } = req.body || {};

    if (!clean(organizationName)) return res.status(400).json({ message: "Organization name is required" });
    if (!clean(spocName)) return res.status(400).json({ message: "SPOC name is required" });
    if (!clean(registeredAddress)) return res.status(400).json({ message: "Registered address is required" });

    let aiExpertise = domainExpertise;
    if (domainExpertise) {
      try {
        const aiRes = await fetch('http://127.0.0.1:8000/categorize-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: domainExpertise })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.expertise && Array.isArray(aiData.expertise)) {
          aiExpertise = aiData.expertise.join(', ');
        }
      } catch (e) {
        console.error('AI Profile categorization failed:', e);
      }
    }

    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO organizations
        (user_id, organization_name, registration_number, spoc_name, spoc_contact, domain, domain_expertise, registered_address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (user_id) DO UPDATE SET
        organization_name = EXCLUDED.organization_name,
        registration_number = EXCLUDED.registration_number,
        spoc_name = EXCLUDED.spoc_name,
        spoc_contact = EXCLUDED.spoc_contact,
        domain = EXCLUDED.domain,
        domain_expertise = EXCLUDED.domain_expertise,
        registered_address = EXCLUDED.registered_address,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        user.user_id,
        clean(organizationName),
        clean(registrationNumber) || null,
        clean(spocName),
        clean(spocContact) || user.phone_number || "",
        clean(domain) || "Societal Innovation",
        clean(aiExpertise) || "",
        clean(registeredAddress),
      ]
    );
    await client.query("COMMIT");
    res.json({ message: "Organization profile saved", profile: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("/api/profile/organization:", err);
    res.status(500).json({ message: "Could not save organization profile", error: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/profile/industry", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    if (user.sub_type !== "INDUSTRY") return res.status(403).json({ message: "Industry profile required" });

    const {
      industryName, industryType = "Technology", spocName, designation,
      officialEmail, phoneNumber, domainExpertise, companyAddress, csrBudgetAvailable,
    } = req.body || {};

    if (!clean(industryName)) return res.status(400).json({ message: "Industry name is required" });
    if (!clean(spocName)) return res.status(400).json({ message: "SPOC name is required" });
    if (!clean(companyAddress)) return res.status(400).json({ message: "Company address is required" });

    let aiExpertise = domainExpertise;
    if (domainExpertise) {
      try {
        const aiRes = await fetch('http://127.0.0.1:8000/categorize-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: domainExpertise })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.expertise && Array.isArray(aiData.expertise)) {
          aiExpertise = aiData.expertise.join(', ');
        }
      } catch (e) {
        console.error('AI Profile categorization failed:', e);
      }
    }

    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO industries
        (user_id, industry_name, industry_type, spoc_name, designation, official_email, phone_number, domain_expertise, company_address, csr_budget_available)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (user_id) DO UPDATE SET
        industry_name = EXCLUDED.industry_name,
        industry_type = EXCLUDED.industry_type,
        spoc_name = EXCLUDED.spoc_name,
        designation = EXCLUDED.designation,
        official_email = EXCLUDED.official_email,
        phone_number = EXCLUDED.phone_number,
        domain_expertise = EXCLUDED.domain_expertise,
        company_address = EXCLUDED.company_address,
        csr_budget_available = EXCLUDED.csr_budget_available,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        user.user_id,
        clean(industryName),
        clean(industryType) || "Technology",
        clean(spocName),
        clean(designation) || null,
        clean(officialEmail) || user.email || "",
        clean(phoneNumber) || null,
        clean(aiExpertise) || "",
        clean(companyAddress),
        csrBudgetAvailable ? Number(csrBudgetAvailable) : null,
      ]
    );
    await client.query("COMMIT");
    res.json({ message: "Industry profile saved", profile: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("/api/profile/industry:", err);
    res.status(500).json({ message: "Could not save industry profile", error: err.message });
  } finally {
    client.release();
  }
});

app.put("/api/profile/university", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    if (user.sub_type !== "UNIVERSITY") return res.status(403).json({ message: "University profile required" });

    const {
      universityName, aisheCode, spocName, spocNumber,
      officialEmail, institutionalAddress, domainExpertise,
    } = req.body || {};

    if (!clean(universityName)) return res.status(400).json({ message: "University name is required" });
    if (!clean(spocName)) return res.status(400).json({ message: "SPOC name is required" });
    if (!clean(institutionalAddress)) return res.status(400).json({ message: "Institutional address is required" });

    let aiExpertise = domainExpertise;
    if (domainExpertise) {
      try {
        const aiRes = await fetch('http://127.0.0.1:8000/categorize-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: domainExpertise })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.expertise && Array.isArray(aiData.expertise)) {
          aiExpertise = aiData.expertise.join(', ');
        }
      } catch (e) {
        console.error('AI Profile categorization failed:', e);
      }
    }

    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO universities
        (user_id, university_name, aishe_code, spoc_name, spoc_number, official_email, institutional_address, domain_expertise)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (user_id) DO UPDATE SET
        university_name = EXCLUDED.university_name,
        aishe_code = EXCLUDED.aishe_code,
        spoc_name = EXCLUDED.spoc_name,
        spoc_number = EXCLUDED.spoc_number,
        official_email = EXCLUDED.official_email,
        institutional_address = EXCLUDED.institutional_address,
        domain_expertise = EXCLUDED.domain_expertise,
        updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        user.user_id,
        clean(universityName),
        clean(aisheCode) || null,
        clean(spocName),
        clean(spocNumber) || "",
        clean(officialEmail) || user.email || "",
        clean(institutionalAddress),
        clean(aiExpertise) || "",
      ]
    );
    await client.query("COMMIT");
    res.json({ message: "University profile saved", profile: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("/api/profile/university:", err);
    res.status(500).json({ message: "Could not save university profile", error: err.message });
  } finally {
    client.release();
  }
});

// ---------------- Categories ----------------
app.get("/api/categories", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT category_id, category_name, icon_key, description
       FROM problem_categories ORDER BY category_id`
    );
    res.json({ categories: rows });
  } catch (err) {
    res.status(500).json({ message: "Could not load categories" });
  }
});

// Geocode on the server instead of calling Nominatim from the preview iframe.
// Besides avoiding browser CORS restrictions, this lets us turn sentence-style
// input ("X is located at Y") into the concise place queries geocoders expect.
function geocodeQueries(value) {
  const query = clean(value)?.replace(/\s+/g, " ").replace(/[.!?]+$/, "");
  if (!query) return [];

  const candidates = [];
  const locationSentence = query.match(/^(.+?)\s+(?:is\s+)?(?:located|situated)\s+(?:at|in|near)\s+(.+)$/i);
  if (locationSentence) {
    candidates.push(`${locationSentence[1]}, ${locationSentence[2]}`);
    const localityParts = locationSentence[2]
      .split(",")
      .map(part => part.trim())
      .filter(part => part && !/^\d{6}$/.test(part));
    if (localityParts.length > 1) {
      candidates.push(`${locationSentence[1]}, ${localityParts.slice(-2).join(", ")}, India`);
    }
    candidates.push(`${locationSentence[2]}, India`);
    candidates.push(locationSentence[2]);
  } else {
    candidates.push(query);
    if (!/\bindia\b/i.test(query)) candidates.push(`${query}, India`);
  }

  return [...new Set(candidates)];
}

app.get("/api/geocode", verifyToken, async (req, res) => {
  const queries = geocodeQueries(req.query.query);
  if (!queries.length) {
    return res.status(400).json({ message: "Please enter an address to search." });
  }
  if (queries[0].length > 300) {
    return res.status(400).json({ message: "Address is too long. Please enter a shorter address." });
  }

  try {
    for (const [index, query] of queries.entries()) {
      // Nominatim's public service allows at most one request per second.
      if (index > 0) await new Promise(resolve => setTimeout(resolve, 1000));
      const params = new URLSearchParams({
        format: "jsonv2",
        q: query,
        limit: "1",
        countrycodes: "in",
        addressdetails: "1",
        "accept-language": "en",
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "NavJhar-SIH-26043/1.0 (address geocoding)",
        },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        throw new Error(`Geocoding provider returned ${response.status}`);
      }

      const results = await response.json();
      const match = results[0];
      if (!match) continue;

      const latitude = Number(match.lat);
      const longitude = Number(match.lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;

      const address = match.address || {};
      return res.json({
        latitude,
        longitude,
        displayName: match.display_name || query,
        address: {
          district: address.state_district || address.county || address.district,
          block: address.suburb || address.city_district || address.subdistrict,
          village: address.village || address.town || address.city || address.municipality,
          pincode: address.postcode,
        },
      });
    }

    return res.status(404).json({ message: "Address not found. Try a shorter address or choose it on the map." });
  } catch (err) {
    console.error("GET /api/geocode:", err.message);
    return res.status(502).json({ message: "Location service is temporarily unavailable. Please try again or choose on the map." });
  }
});

// ---------------- Problems ----------------
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 10, fileSize: 50 * 1024 * 1024 },
});
app.post("/api/problems", verifyToken, upload.array("media", 10), async (req, res) => {
  const client = await pool.connect();
  const mediaFiles = req.files || [];
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });

    const {
      categoryId: rawCategoryId, categoryName, title, description, latitude, longitude,
      district, block, panchayatWard, landmark, siteAddress,
      reportedFor = "Myself", beneficiaryName, beneficiaryPhone, isAnonymous = false,
      severity = "MEDIUM", voiceDurationSeconds,
    } = req.body || {};

    if ((!rawCategoryId && !clean(categoryName)) || !clean(title) || !clean(description) || !clean(district) || !clean(block) || !clean(siteAddress)) {
      return res.status(400).json({ message: "category, title, description, district, block and siteAddress are required" });
    }
    const cat = await client.query(
      `SELECT category_id, category_name FROM problem_categories WHERE category_id = $1 OR LOWER(category_name) = LOWER($2) LIMIT 1`,
      [rawCategoryId || -1, clean(categoryName) || ""]
    );
    if (!cat.rows[0]) return res.status(400).json({ message: "Invalid category" });

    const code = makeProblemCode(cat.rows[0].category_name);
      const result = await client.query(
        `INSERT INTO problems
         (problem_code, submitted_by, category_id, title, description, latitude, longitude,
          district, block, panchayat_ward, landmark, site_address, reported_for,
          beneficiary_name, beneficiary_phone, is_anonymous, severity, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,'SUBMITTED')
         RETURNING *`,
       [code, user.user_id, cat.rows[0].category_id, clean(title), clean(description),
 latitude === "" ? null : latitude,
 longitude === "" ? null : longitude,
       clean(district), clean(block), clean(panchayatWard) || null, clean(landmark) || null, clean(siteAddress),
       reportedFor, clean(beneficiaryName) || null, clean(beneficiaryPhone) || null, Boolean(isAnonymous), severity]
    );
    const mediaWarnings = [];
    for (const file of mediaFiles) {
      const objectName = `${user.user_id}/${result.rows[0].problem_id}/${Date.now()}-${file.originalname}`;
      let fileUrl = objectName;
      let storagePath = objectName;
      try {
        await uploadToOCI(file, objectName);
      } catch (mediaError) {
        console.error("OCI media upload failed; using local fallback:", mediaError.message);
        const localMedia = await saveMediaLocally(file, objectName);
        fileUrl = localMedia.fileUrl;
        storagePath = localMedia.storagePath;
        mediaWarnings.push({ fileName: file.originalname, message: "Stored locally because OCI is unavailable" });
      }

      await client.query(
    `INSERT INTO problem_media
      (problem_id, media_type, file_url, storage_path, file_name, mime_type, file_size, duration_seconds)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      result.rows[0].problem_id,
       file.mimetype.startsWith("image/")
         ? "IMAGE"
         : file.mimetype.startsWith("video/")
         ? "VIDEO"
         : file.mimetype.startsWith("audio/")
         ? "AUDIO"
         : "DOCUMENT",
       fileUrl,
       storagePath,
      file.originalname,
       file.mimetype,
       file.size,
       file.mimetype.startsWith("audio/") && voiceDurationSeconds
         ? Math.max(0, Math.min(300, Number.parseInt(voiceDurationSeconds, 10) || 0))
         : null,
    ]
      );
}
    res.status(201).json({
  problem: result.rows[0],
  media: mediaFiles.map(file => file.originalname),
  mediaWarnings,
}); 
  } catch (err) {
    console.error("POST /api/problems:", err);
    res.status(500).json({ message: "Could not create problem", error: err.message });
  } finally {
    client.release();
  }
});   

app.get("/api/problems/my", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    
    let query = `
      SELECT p.*, c.category_name
      FROM problems p
      JOIN problem_categories c ON c.category_id = p.category_id
      WHERE p.submitted_by = $1
      ORDER BY p.created_at DESC
    `;
    let params = [user.user_id];

    if (user.sub_type === 'PANCHAYAT') {
      const panchayat = await pool.query(`SELECT panchayat_name FROM panchayats WHERE user_id = $1`, [user.user_id]);
      if (panchayat.rows.length > 0) {
        query = `
          SELECT p.*, c.category_name
          FROM problems p
          JOIN problem_categories c ON c.category_id = p.category_id
          WHERE p.panchayat_ward ILIKE $1
          ORDER BY p.created_at DESC
        `;
        params = [`%${panchayat.rows[0].panchayat_name}%`];
      }
    } else if (['INDUSTRY', 'UNIVERSITY', 'ORGANIZATION'].includes(user.sub_type)) {
      query = `
        SELECT p.*, c.category_name, pi.status as initiative_status, pi.proposed_solution
        FROM problem_initiatives pi
        JOIN problems p ON pi.problem_id = p.problem_id
        JOIN problem_categories c ON c.category_id = p.category_id
        WHERE pi.solver_user_id = $1
        ORDER BY pi.created_at DESC
      `;
      params = [user.user_id];
    }
    const { rows } = await pool.query(query, params);
    res.json({ problems: rows });
  } catch (err) {
    res.status(500).json({ message: "Could not load your problems" });
  }
});

// --- ACCEPT PROBLEM (SOLVER ACTION) ---
app.patch("/api/problems/:problemCode/accept", verifyToken, async (req, res) => {
  try {
    const { problemCode } = req.params;
    const { rowCount } = await pool.query(
      `UPDATE problems SET status = 'ASSIGNED' WHERE problem_code = $1`,
      [problemCode]
    );
    if (rowCount === 0) return res.status(404).json({ message: "Problem not found" });
    res.json({ message: "Problem status updated to ASSIGNED" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting problem" });
  }
});

// --- RECOMMENDED PROBLEMS ROUTE ---
app.get("/api/problems/recommended", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    
    let domains = [];
    if (user.sub_type === "INDUSTRY") {
      const pRes = await pool.query("SELECT domain_expertise FROM industries WHERE user_id = $1", [user.user_id]);
      if (pRes.rows.length) domains = (pRes.rows[0].domain_expertise || "").split(',').map(d => d.trim()).filter(Boolean);
    } else if (user.sub_type === "UNIVERSITY") {
      const pRes = await pool.query("SELECT domain_expertise FROM universities WHERE user_id = $1", [user.user_id]);
      if (pRes.rows.length) domains = (pRes.rows[0].domain_expertise || "").split(',').map(d => d.trim()).filter(Boolean);
    } else if (user.sub_type === "LOCAL_ORGANIZATION" || user.sub_type === "NGO") {
      const pRes = await pool.query("SELECT domain_expertise FROM local_organizations WHERE user_id = $1", [user.user_id]);
      if (pRes.rows.length) domains = (pRes.rows[0].domain_expertise || "").split(',').map(d => d.trim()).filter(Boolean);
    }

    let query = `
      SELECT p.*, c.category_name
      FROM problems p
      JOIN problem_categories c ON c.category_id = p.category_id
      WHERE p.status IN ('SUBMITTED', 'UNDER_REVIEW')
    `;
    let params = [];
    
    if (domains.length > 0) {
      const matchClauses = domains.map((d, i) => `($${i + 1} ILIKE '%' || c.category_name || '%' OR c.category_name ILIKE '%' || $${i + 1} || '%')`);
      query += ` AND (${matchClauses.join(' OR ')})`;
      params = domains;
    }

    query += ` ORDER BY p.created_at DESC LIMIT 50`;
    
    const { rows } = await pool.query(query, params);
    res.json({ problems: rows });
  } catch(e) { 
    console.error(e);
    res.status(500).json({ error: e.message }); 
  }
});

app.get("/api/problems/:problemCode", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.category_name
       FROM problems p
       JOIN problem_categories c ON c.category_id = p.category_id
       WHERE p.problem_code = $1`,
      [req.params.problemCode]
    );
    if (!rows[0]) return res.status(404).json({ message: "Problem not found" });
    res.json({ problem: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Could not load problem" });
  }
});

// Nearby problems. Distance is calculated in PostgreSQL from real GPS coordinates.
app.get("/api/problems/nearby", verifyToken, async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Math.min(Math.max(Number(req.query.radiusKm) || 10, 1), 100);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ message: "lat and lng query parameters are required" });
    }

    const { rows } = await pool.query(
      `SELECT * FROM (
         SELECT p.problem_id, p.problem_code, p.title, p.description, p.latitude, p.longitude,
                p.district, p.block, p.panchayat_ward, p.landmark, p.site_address,
                p.severity, p.status, p.created_at, c.category_name,
                (6371 * acos(LEAST(1, GREATEST(-1,
                  cos(radians($1)) * cos(radians(p.latitude)) *
                  cos(radians(p.longitude) - radians($2)) +
                  sin(radians($1)) * sin(radians(p.latitude))
                )))) AS distance_km
         FROM problems p
         JOIN problem_categories c ON c.category_id = p.category_id
         WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
       ) nearby
       WHERE distance_km <= $3
       ORDER BY distance_km ASC`,
      [lat, lng, radiusKm]
    );
    res.json({ problems: rows });
  } catch (err) {
    console.error("GET /api/problems/nearby:", err);
    res.status(500).json({ message: "Could not load nearby problems" });
  }
});

// ---------------- Notifications ----------------
app.get("/api/notifications", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    const { rows } = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [user.user_id]
    );
    res.json({ notifications: rows });
  } catch (err) {
    res.status(500).json({ message: "Could not load notifications" });
  }
});

app.patch("/api/notifications/:id/read", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE
       WHERE notification_id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, user.user_id]
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Notification not found" });
    res.json({ notification: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Could not update notification" });
  }
});

// ---------------- Feedback ----------------
app.post("/api/problems/:problemId/feedback", verifyToken, async (req, res) => {
  try {
    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });
    const rating = Number(req.body?.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be an integer from 1 to 5" });
    }
    const comments = clean(req.body?.comments) || null;
    let sentiment = "NEUTRAL";
    if (comments) {
      try {
        const fetch = require('node-fetch');
        const aiRes = await fetch('http://127.0.0.1:8000/analyze-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: comments })
        });
        const aiData = await aiRes.json();
        if (aiData && aiData.sentiment) {
          sentiment = aiData.sentiment.toUpperCase();
        }
      } catch(e) {
        console.error("AI Sentiment failed", e);
      }
    }

    const result = await pool.query(
      `INSERT INTO problem_feedback (problem_id, user_id, rating, comments, sentiment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.params.problemId, user.user_id, rating, comments, sentiment]
    );
    res.status(201).json({ feedback: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Could not save feedback", error: err.message });
  }
});

// --- SUBMIT SOLUTION (SOLVER ACTION WITH AI STRUCTURING) ---
app.post("/api/problems/:problemCode/solutions", verifyToken, async (req, res) => {
  try {
    const { problemCode } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Solution text is required" });

    const user = await getDbUser(req.user.uid);
    if (!user) return res.status(404).json({ message: "User not synced" });

    // 1. Get problem id
    const probRes = await pool.query(`SELECT problem_id FROM problems WHERE problem_code = $1`, [problemCode]);
    if (probRes.rows.length === 0) return res.status(404).json({ message: "Problem not found" });
    const problemId = probRes.rows[0].problem_id;

    // 2. Call AI Service to structure the solution
    let structuredData = { title: "Proposed Solution", timeline: "", resources_needed: "", feasibility_score: 0 };
    try {
      const fetch = require('node-fetch');
      const aiRes = await fetch('http://127.0.0.1:8000/structure-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const aiData = await aiRes.json();
      if (!aiData.error) {
        structuredData = { ...structuredData, ...aiData };
      }
    } catch (e) {
      console.error("AI Structure Solution failed:", e);
    }

    // 3. Save to database
    await pool.query("BEGIN");
    
    // Insert into problem_initiatives
    const initRes = await pool.query(
      `INSERT INTO problem_initiatives 
       (problem_id, solver_user_id, initiative_title, proposed_solution, expected_impact, estimated_budget, timeline_display, feasibility_score, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'IN_PROGRESS') RETURNING *`,
      [problemId, user.user_id, structuredData.title || "Proposed Solution", text, structuredData.resources_needed || "", 0, structuredData.timeline || "", structuredData.feasibility_score || 0]
    );

    // Update problem status to IN_PROGRESS
    await pool.query(
      `UPDATE problems SET status = 'IN_PROGRESS' WHERE problem_id = $1`,
      [problemId]
    );

    await pool.query("COMMIT");
    res.json({ message: "Solution submitted and structured successfully", initiative: initRes.rows[0] });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Error submitting solution" });
  }
});

// --- MARK SOLVED (IMPACT REPORT AI) ---
app.post("/api/problems/:problemCode/mark-solved", verifyToken, async (req, res) => {
  try {
    const { problemCode } = req.params;
    await pool.query(`UPDATE problems SET status = 'SOLVED' WHERE problem_code = $1`, [problemCode]);
    const probRes = await pool.query(`SELECT description FROM problems WHERE problem_code = $1`, [problemCode]);
    const initRes = await pool.query(`SELECT proposed_solution FROM problem_initiatives pi JOIN problems p ON pi.problem_id = p.problem_id WHERE p.problem_code = $1`, [problemCode]);
    let probDesc = probRes.rows[0]?.description || "";
    let solDesc = initRes.rows[0]?.proposed_solution || "";
    const fetch = require('node-fetch');
    const aiRes = await fetch('http://127.0.0.1:8000/generate-impact-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challenge_data: { description: probDesc }, solution_data: { solution: solDesc }, feedback_list: [] })
    });
    const aiData = await aiRes.json();
    const reportRes = await pool.query(
      `INSERT INTO impact_reports (problem_code, title, summary, key_metrics, challenges_overcome) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [problemCode, "AI Impact Report", aiData.report || "No summary generated", "[]", ""]
    );
    res.json({ message: "Solved & Impact Report Generated", report: reportRes.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
});

// --- AI ANALYZE PROBLEM ---
app.post("/api/problems/ai-analyze", verifyToken, async (req, res) => {
  try {
    const { text, latitude, longitude } = req.body;
    let existing = [];
    if (latitude && longitude) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      const radiusKm = 10;
      const nearbyRes = await pool.query(
        `SELECT problem_code, title, description, latitude, longitude,
          (6371 * acos(LEAST(1, GREATEST(-1, cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))))) AS distance_km
         FROM problems WHERE latitude IS NOT NULL AND longitude IS NOT NULL
         AND (6371 * acos(LEAST(1, GREATEST(-1, cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))))) <= $3`,
        [lat, lng, radiusKm]
      );
      existing = nearbyRes.rows.map(r => ({ id: r.problem_code, text: r.description, location: "Nearby", coordinates: `${r.latitude},${r.longitude}` }));
    }
    const fetch = require('node-fetch');
    const aiRes = await fetch('http://127.0.0.1:8000/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, coordinates: `${latitude},${longitude}`, existing_problems: existing })
    });
    const aiData = await aiRes.json();
    res.json(aiData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error analyzing problem" });
  }
});

// --- SOLUTION GET ROUTE ---
app.get("/api/problems/:problemCode/solution", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM problem_initiatives pi JOIN problems p ON pi.problem_id = p.problem_id WHERE p.problem_code = $1", [req.params.problemCode]);
    res.json({ solution: rows[0] || null });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// --- ADMIN ROUTES ---
app.get("/api/admin/problems", async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT problem_code, title, status FROM problems ORDER BY created_at DESC`);
    res.json({ problems: rows });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.get("/api/admin/impact-reports", async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM impact_reports ORDER BY generated_at DESC`);
    res.json({ reports: rows });
  } catch(e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/admin/problems/:problemCode/assign", async (req, res) => {
  try {
    await pool.query(`UPDATE problems SET status = 'ASSIGNED' WHERE problem_code = $1`, [req.params.problemCode]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---------------- Error handler ----------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
