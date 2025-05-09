import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(cors());

// ✅ MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Suhas@123",
  database: "ruchitha",
});

// ✅ Get Disorders List
app.get("/api/disorders", (req, res) => {
  const sql = "SELECT problems_name FROM problems";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching disorders:", err.message);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// ✅ Fetch Food Info Based on Disorder and Age
app.get("/api/foods", (req, res) => {
  let { disorder, age } = req.query;

  if (!disorder || !age) {
    return res.status(400).json({ error: "Missing disorder or age parameter" });
  }

  // ✅ Sanitize and format inputs
  disorder = disorder.trim();
  age = age.trim().toLowerCase();

  // ✅ Construct table name safely
  const tableName = disorder.replace(/\s+/g, "_");

  // ✅ Prevent SQL injection by validating table name pattern
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    return res.status(400).json({ error: "Invalid disorder name" });
  }

  // ✅ Prepare query
  const sql = `SELECT * FROM \`${tableName}\` WHERE LOWER(TRIM(age)) = ?`;

  connection.query(sql, [age], (err, results) => {
    if (err) {
      console.error(`❌ Error querying table '${tableName}':`, err.message);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!results || results.length === 0) {
      console.log(`ℹ️ No matching data found for ${disorder} with age ${age}`);
      return res.json([]);
    }

    console.log(`✅ ${results.length} result(s) found in '${tableName}' for age '${age}'`);
    res.json(results);
  });
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
