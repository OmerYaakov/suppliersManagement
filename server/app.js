import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

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

export default app;
