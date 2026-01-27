require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("./config/passport");
const helmet = require("helmet");
const Fuse = require('fuse.js');

const connectDB = require("./config/db");

// ===== init =====
connectDB();
require("./config/passport");
require("./models/usersModel");

const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// เสิร์ฟไฟล์ static จากโฟลเดอร์ uploads
app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Session for Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
  })
);

// ===== fuse.js search setup =====
let data = [];
let fuse;

async function loadData() {
  const fs = require('fs');
  const raw = fs.readFileSync('./data/geography.json', 'utf8');
  data = JSON.parse(raw);  // Array of {provinceNameTh, districtNameTh, subdistrictNameTh, postalCode, ...}[web:1]
  
  fuse = new Fuse(data, {
    keys: ['provinceNameTh', 'provinceNameEn', 'districtNameTh', 'districtNameEn', 'subdistrictNameTh', 'subdistrictNameEn', 'postalCode'],
    threshold: 0.4,  // Fuzzy match tolerance
    ignoreLocation: true
  });
}

app.get('/search', (req, res) => {
  const { q } = req.query;  // Text query, e.g., ?q=ลพบุรี or ?q=42
  if (!q) return res.json([]);

  const results = fuse.search(q).slice(0, 50);  // Top 50 matches
  res.json(results.map(r => r.item));  // Returns full objects with hierarchy codes[web:1]
});


// ===== routes =====
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ดัก chrome devtools error
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use('/api/ingredients', ingredientRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});
module.exports = app;