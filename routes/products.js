const { Product } = require("../models/product");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get('/:id',async(req,res=>{
  const productList = await product.findById(req.params.id,
    { 
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.category,
      category: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    }
    );
}))

router.post(`/`, async (req, res) => {
  //Validating the category
  const category = await category.findById(req.body.category);
  if (!category) {
    return res.status(404).send("Invalid Category cannot add this product");
  }
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.category,
    category: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  newProduct = await product.save();
  if (!product) {
    return res.send(500).send("Product cannot be created");
  }
  return res.send(newProduct);
});

module.exports = router;
