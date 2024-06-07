const express = require('express');
const userModel = require("../models/userModel");
const productModel = require('../models/productModel');
const purchaseModel = require("../models/purchaseModel");
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const recentItems = await userModel.find({});
    const products = recentItems.map(item => item.products).flat();
    console.log(products)
    const purchases=  purchaseModel.find({ productId: { $in: products } });
  
    
  res.json()
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
