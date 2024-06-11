const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/', auth, async (req, res) => {
    const userId = new ObjectId(req.session.user._id);
    const user = await userModel.findById(userId);

    const productPromises = user.products.map(async productId => await productModel.findById(productId));
    const products = await Promise.all(productPromises);

    res.render('profile', { accountType: req.session.user.accountType, user, products });
});

router.get('/:id', auth, async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const user = await userModel.findById(userId);

    const productPromises = user.products.map(async productId => await productModel.findById(productId));
    const products = await Promise.all(productPromises);

    res.render('profile', { accountType: req.session.user.accountType, user, products });
});

module.exports = router;
