import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import {
  uploadProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/ProductController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const random = uuidv4();
    cb(null, `${random}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Routes
router.get("/getproducts", getAllProducts);
router.get("/getbyproducts/:id", getProductById);
router.post("/uploadproduct", upload.single("myfile"), uploadProduct);
router.delete("/deleteproduct/:id", deleteProduct);
router.put("/updateProduct/:id", upload.single("myfile"), updateProduct);

export default router;
