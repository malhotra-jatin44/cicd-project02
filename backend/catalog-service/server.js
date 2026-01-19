const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*",   // <-- For now allow everything (works in your setup)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,   // ✅ CORRECT (uses Docker service name)
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});


db.connect(err => {
  if (err) {
    console.error("MySQL Connection Failed:", err);
    return;
  }
  console.log("Connected to MySQL");

  // Create table AFTER successful connection
  db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      price INT
    )
  `, (err) => {
    if (err) console.error("Table creation failed:", err);
    else console.log("Products table ready");
  });

  // Insert sample data
  db.query(`
    INSERT IGNORE INTO products (id, name, price) 
    VALUES 
    (1,'Laptop',70000),
    (2,'Phone',30000),
    (3,'Headphones',5000)
  `, (err) => {
    if (err) console.error("Insert failed:", err);
    else console.log("Sample products inserted");
  });
});

app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.setHeader("Access-Control-Allow-Origin", "*"); // extra safety
    res.json(results);
  });
});


app.listen(3001, () => console.log("Catalog Service on 3001"));
