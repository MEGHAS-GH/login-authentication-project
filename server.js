require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// PostgreSQL Connection
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test DB Connection
pool.query("SELECT 1")
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection error:", err));

// Create Users Table If Not Exists
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`)
.then(() => console.log("✅ Users table ready"))
.catch(err => console.error("Table creation error:", err));

/* ================= REGISTER ROUTE ================= */

app.post("/register", async (req, res) => {

  const { username, password } = req.body;

  // 🔐 PASSWORD LENGTH VALIDATION
  if (password.length < 8 || password.length > 20) {
    return res.json({
      message: "Password must be between 8 and 20 characters"
    });
  }

  // 🔐 STRONG PASSWORD VALIDATION
  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

  if (!strongPassword.test(password)) {
    return res.json({
      message: "Password must contain uppercase, lowercase, number and special character"
    });
  }

  try {
    // Check if username already exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.json({ message: "Username already exists" });
    }

    // Insert user
    await pool.query(
      "INSERT INTO users(username, password) VALUES($1, $2)",
      [username, password]
    );

    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= LOGIN ROUTE ================= */

app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false });
    }

    const user = result.rows[0];

    if (user.password === password) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port 5000");
});

