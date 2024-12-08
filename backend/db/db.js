import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.k2vouiz.mongodb.net/curd`
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((err) => console.log("Error connecting to MongoDB Atlas", err));
