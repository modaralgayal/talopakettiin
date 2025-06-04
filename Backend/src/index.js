import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { initFirebaseAdmin } from "./config/firebaseConfig.js";

dotenv.config();
const app = express();
const PORT = 8000;

// Initialize Firebase Admin before anything else
await initFirebaseAdmin();

// Define allowed origins for CORS
const allowedOrigins = [
  "https://talopakettiin.fi",
  "https://api.talopakettiin.fi",
  "https://talopakettiin.fi",
  "https://www.talopakettiin.fi",
  "http://www.talopakettiin.fi",
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:8000",
  "https://localhost:8000"
];

// Use CORS middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("dist"));

app.set("trust proxy", true);

// Configure CORS with more specific options
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "usertype", "Set-Cookie"],
    exposedHeaders: ["Content-Range", "X-Content-Range", "Set-Cookie"],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

app.use((req, res, next) => {
  req.domain = req.headers.host;
  next();
});

// Route Handlers
app.use("/api/user", userRoutes);
app.use("/api/forms", formRoutes);

app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({
    message:
      "This is a test. Connection established between frontend and backend",
  });
});

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./dist" });
});

// Middleware to catch TokenExpiredError
const checkTokenExpiration = (err, req, res, next) => {
  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ error: "Token has expired. Please log in again." });
  }
  next(err);
};

app.use((err, req, res, next) => {
  console.error("Error is here: ", err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

// Add this middleware after your token verification logic
app.use(checkTokenExpiration);

// Start the server
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
