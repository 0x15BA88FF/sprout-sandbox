const express = require('express');
const mongodb = require('mongodb');
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const purchaseModel = require("../models/purchaseModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get("/", async (req, res) => {
	const userId = ObjectId(req.session.user._id);

	try {
		const user = await userModel.findById(userId);

		const dataPromises = user.products.map(async productId => {
			const product = await productModel.findById(productId);
			const purchases = await purchaseModel.find({ productId });
			const quantitiesPromises = purchases.map(data => data.quantity);
			const quantities = await Promise.all(quantitiesPromises);
			const quantity = quantities.reduce((acc, quantity) => acc + quantity, 0);
			return { _id: product._id, title: product.title, quantity };
		});
        const productsData = await Promise.all(dataPromises);

		res.json(productsData);
	} catch (error) {
		console.error('Error fetching recent items:', error);
		res.status(500).json({ error: 'An error occurred' });
	}
});

module.exports = router;
