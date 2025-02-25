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
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

const uploadsPath = path.resolve(process.cwd(), `./public/uploads`);
mongoose
  .connect("" + process.env.DB)
  .then(() => {
    console.log("Database connected: " + process.env.DB);
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/transaction", transactionRoute);
app.use("/supplier", supplierRoute);
app.use("/receivers", receiversRout);
app.use("/transactionCategory", transactionCategoryRoute);
app.use("/transactionType", transactionTypeRoute);
app.use("/public/uploads", express.static(path.join(__dirname, "public/uploads")));
export default app;
