import ProductModel from "../models/ProductModel.js";
import fs from "fs";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProduct = async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!req.file || !name || !description || !price || !category) {
    return res.status(400).json({
      error:
        "All fields (name, description, price, category, and image) are required",
    });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const product = new ProductModel({
      name,
      description,
      price,
      category,
      Image_Url: result.secure_url,
    });

    const productUpload = await product.save();

    if (productUpload) {
      fs.unlinkSync(req.file.path);
      return res.status(200).json({
        message: "Product uploaded successfully",
        product: productUpload,
      });
    }
  } catch (error) {
    console.error("Error uploading product:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      error: "Failed to upload product",
      details: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Extract the public ID from the image URL
    const imageUrl = product.Image_Url;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extracts public_id from the URL

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res
        .status(500)
        .json({ error: "Failed to delete image from Cloudinary" });
    }

    // Delete the product from the database
    const deletesuccess = await ProductModel.deleteOne({ _id: id });
    if (deletesuccess) {
      res
        .status(200)
        .json({ message: "Product and image deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve products", details: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error retrieving product by ID:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve product", details: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      if (product.Image_Url) {
        const publicId = product.Image_Url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      product.Image_Url = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};
