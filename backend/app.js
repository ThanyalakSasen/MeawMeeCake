const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const helmet = require("helmet");


connectDB();
const app = express();
require("./config/db");
require("./config/passport");
require("./models/usersModel");





// Load models
require("./models/usersModel");
const authRoutes = require('./routes/authRoutes');
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false,
}));
// เพิ่ม Route เพื่อดัก Error 404 ของ Chrome DevTools (เพื่อความสะอาดของ Console)
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end(); 
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/email", require("./routes/emailRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));



module.exports = app;
