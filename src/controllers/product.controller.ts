import { Request, Response, NextFunction } from "express";
import { upload } from "../middleware/upload";
import * as productService from "../services/product.service";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ success: false, message: "No image in the request" });
    }
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const imageUrl = `${basePath}${file.filename}`;
    const product = await productService.createProduct(req.body, imageUrl);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    let imageUrl: string | undefined;
    if (file) {
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imageUrl = `${basePath}${file.filename}`;
    }
    const product = await productService.updateProduct(req.params.id, req.body, imageUrl);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: "the product is deleted!" });
  } catch (err) {
    next(err);
  }
};

export const getProductCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await productService.getProductCount();
    res.status(200).json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = parseInt(req.params.count) || 0;
    const products = await productService.getFeaturedProducts(count);
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const updateGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    let imagesPaths: string[] = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    if (files) {
      imagesPaths = files.map((file) => `${basePath}${file.filename}`);
    }
    const product = await productService.updateProductGallery(req.params.id, imagesPaths);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};
