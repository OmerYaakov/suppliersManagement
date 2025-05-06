import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import transactionRoute from "./Routes/transactionRoute.js";
import supplierRoute from "./Routes/supplierRoute.js";
import receiversRout from "./Routes/receiverTransactionRoute.js";
import transactionCategoryRoute from "./Routes/transactionCategoryRoute.js";
import transactionTypeRoute from "./Routes/transactionTypeRoute.js";
import { fileURLToPath } from "url";
import userRoute from "./Routes/userRoute.js";
import AWS from "aws-sdk";
import path from "path";

dotenv.config();
const app = express();
if (process.env.NODE_ENV === "production") {
  console.log = function () {}; // Disable all console.log in production
}

app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});

// S3 Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
export const s3 = new AWS.S3(); // Export for use in routes/controllers

const uploadsPath = path.resolve(process.cwd(), `./public/uploads`);
mongoose
  .connect(process.env.DB_ATLAS)
  .then(() => {
    console.log("Database connected: " + process.env.DB_ATLAS); // Log successful connection
  })
  .catch((err) => {
    console.log("Error: ", err); // Log connection error
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = ["https://supplier-mang.com", "https://www.supplier-mang.com"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors()); // Enable pre-flight requests for all routes
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
app.use("/api/transaction", transactionRoute);
app.use("/api/supplier", supplierRoute);
app.use("/api/receivers", receiversRout);
app.use("/api/transactionCategory", transactionCategoryRoute);
app.use("/api/transactionType", transactionTypeRoute);
app.use("/api/public/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/user", userRoute);
export default app;
