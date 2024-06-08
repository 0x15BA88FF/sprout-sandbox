const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/', auth, allowAccess('trader', 'consumer'), async (req, res) => {
    const userId = new ObjectId(req.session.user._id);
    const user = await userModel.findOne({ _id: userId });

    const productPromises = user.cart.map(productId => productModel.findOne({ _id: productId }));
    const products = await Promise.all(productPromises);

    res.render('cart', { accountType: req.session.user.accountType, products });
});

module.exports = router;
