const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/:id', auth, async (req, res) => {
    console.log(typeof(req.params.id))
    const userId = new ObjectId(req.params.id);
    const user = await userModel.findOne({ _id: userId });

    const productPromises = user.cart.map(productId => productModel.findOne({ _id: productId }));
    const products = await Promise.all(productPromises);

    res.render('profile', { user, products });
});

router.get('/', auth, async (req, res) => {
    const userId = new ObjectId(req.session.user._id);
    const user = await userModel.findOne({ _id: userId });
    let products = [];

    user.products.forEach(async productId => {
        products.push(await productModel.findOne({ _id: productId }));
    });

    res.render('profile', { user, products});
});

module.exports = router;