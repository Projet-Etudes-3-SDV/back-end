import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Product from "../models/product.model";
import Category from "../models/category.model";

const uploadDir = path.join(process.cwd(), "storage", "images");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage }).single("file");

const handleUpload = (
  req: Request,
  res: Response,
  updateFn: (id: string, imageUrl: string) => Promise<void>
) => {
  upload(req, res, async (err) => {
    if (err || !req.file) {
      return res.status(400).json({ error: "Upload failed" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const id = req.params.id;

    try {
      await updateFn(id, imageUrl);
      res.status(200).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: "Database update failed" });
    }
  });
};

export const uploadProductImage = (req: Request, res: Response) => {
  handleUpload(req, res, async (id, imageUrl) => {
    await Product.findOneAndUpdate({ id }, { imageUrl });
  });
};

export const uploadCategoryImage = (req: Request, res: Response) => {
  handleUpload(req, res, async (id, imageUrl) => {
    await Category.findOneAndUpdate({ id }, { imageUrl });
  });
};
