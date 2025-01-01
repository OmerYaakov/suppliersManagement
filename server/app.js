import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import transactionRoute from "./Routes/transactionRoute.js";
import supplierRoute from "./Routes/supplierRoute.js";
import receiversRout from "./Routes/receiverTransactionRoute.js";
import transactionCategoryRoute from "./Routes/transactionCategoryRoute.js";

dotenv.config();
const app = express();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

mongoose
  .connect("" + process.env.DB)
  .then(() => {
    console.log("Database connected: " + process.env.DB);
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/transaction", transactionRoute);
app.use("/supplier", supplierRoute);
app.use("/receivers", receiversRout);
app.use("/transactionCategory", transactionCategoryRoute);
export default app;
