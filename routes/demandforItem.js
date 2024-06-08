const express = require('express');
const purchaseModel = require("../models/purchaseModel");
const path = require("path");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const router = express.Router();

router.get("/:name", async (req, res) => {
  try {
    // Get the search string from request parameters
    const searchString = req.params.name;

    // Define the date seven days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Create a regex for the search string
    const regex = new RegExp(searchString, 'i'); // Case-insensitive regex
    // Define the query to find recent items created within the last seven days
    const query = {
      title: { $regex: regex }, // Search string regex
      // createdAt: { $gte: sevenDaysAgo } // Documents created within the last seven days
    };
    // Find matching items
    const recentItems = await productModel.find(query);
    console.log(recentItems)
    // Do something with the matching items
    res.json(recentItems);
  } catch (error) {
    console.error('Error fetching recent items:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
