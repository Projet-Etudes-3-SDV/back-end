import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/product.model";
import Category from "../models/category.model";

const uploadDir = path.join(process.cwd(), "storage", "images");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (err) {
      cb(err as Error, uploadDir);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage }).single("file");

const deleteOldImage = (oldPath: string) => {
  const relativePath = oldPath.replace(/^\/+/, '').replace(/^uploads\//, 'images/');
  const fullPath = path.join(process.cwd(), "storage", relativePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const handleUpload = (
  req: Request,
  res: Response,
  updateFn: (id: string, imageUrl: string) => Promise<void>,
  getCurrentImageUrl: (id: string) => Promise<string | null>
) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Multer error", details: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const id = req.params.id;

    try {
      const oldImageUrl = await getCurrentImageUrl(id);
      if (oldImageUrl) deleteOldImage(oldImageUrl);

      await updateFn(id, imageUrl);
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("DB update failed", error);
      res.status(500).json({ error: "Database update failed" });
    }
  });
};

// === Produits ===
export const uploadProductImage = (req: Request, res: Response) => {
  handleUpload(
    req,
    res,
    async (id, imageUrl) => {
      await Product.findOneAndUpdate({ id }, { imageUrl });
    },
    async (id) => {
      const product = await Product.findOne({ id });
      return product?.imageUrl || null;
    }
  );
};

// === Catégories ===
export const uploadCategoryImage = (req: Request, res: Response) => {
  handleUpload(
    req,
    res,
    async (id, imageUrl) => {
      await Category.findOneAndUpdate({ id }, { imageUrl });
    },
    async (id) => {
      const category = await Category.findOne({ id });
      return category?.imageUrl || null;
    }
  );
};
