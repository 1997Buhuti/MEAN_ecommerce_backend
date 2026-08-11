import { Router, Request, Response } from "express";
import { Product } from "../models/product";
import { Category } from "../models/category";
import mongoose from "mongoose";
import multer, { FileFilterCallback, Multer } from "multer";

const FILE_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError: Error | null = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions: Multer = multer({ storage: storage });

interface ProductRequest {
  name: string;
  description: string;
  richDescription?: string;
  brand: string;
  price: number;
  category: string;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
}

const router = Router();

router.get(`/`, async (req: Request, res: Response) => {
  let filter: Record<string, unknown> = {};
  if (req.query.categories) {
    filter = { category: (req.query.categories as string).split(",") };
  }

  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get(`/:id`, async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(
  `/`,
  uploadOptions.single("image"),
  async (req: Request<{}, {}, ProductRequest>, res: Response) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const file = req.file as Express.Multer.File | undefined;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product) return res.status(500).send("The product cannot be created");

    res.send(product);
  }
);

router.put(
  "/:id",
  uploadOptions.single("image"),
  async (req: Request<{ id: string }, {}, ProductRequest>, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("Invalid Product!");

    const file = req.file as Express.Multer.File | undefined;
    let imagepath: string;

    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagepath = `${basePath}${fileName}`;
    } else {
      imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(500).send("the product cannot be updated!");

    res.send(updatedProduct);
  }
);

router.delete("/:id", (req: Request, res: Response) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res.status(200).json({
          success: true,
          message: "the product is deleted!",
        });
      } else {
        return res.status(404).json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req: Request, res: Response) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

router.get(`/get/featured/:count`, async (req: Request<{ count: string }>, res: Response) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req: Request<{ id: string }>, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }
    const files = req.files as Express.Multer.File[] | undefined;
    let imagesPaths: string[] = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  }
);

export default router;
