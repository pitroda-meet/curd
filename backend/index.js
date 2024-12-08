import express from "express";
import dotenv from "dotenv";
import "./db/db.js";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middleware for parsing JSON
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api", productRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
