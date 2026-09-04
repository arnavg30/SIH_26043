const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Pool } = require("pg");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const app = express();

app.use(cors());
app.use(express.json());

// ==================== Firebase Admin ====================

const serviceAccount = require("./firebase-service-account.json");

initializeApp({
  credential: cert(serviceAccount),
});

const firebaseAuth = getAuth();

// ==================== PostgreSQL ====================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err.message);
  } else {
    console.log("PostgreSQL connected!");
  }
});

// ==================== Firebase Authentication Middleware ====================

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await firebaseAuth.verifyIdToken(token);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// ==================== Test API ====================

// Public route
app.get("/", (req, res) => {
  res.json({
    message: "SIH Backend is running",
  });
});

// Protected route - Firebase login required
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Authentication successful!",
    uid: req.user.uid,
    email: req.user.email,
  });
});

// ==================== Start Server ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});