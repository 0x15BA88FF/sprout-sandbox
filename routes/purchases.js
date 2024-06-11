const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const purchaseModel = require("../models/purchaseModel");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/', auth, allowAccess('producer', 'trader', 'consumer'), async (req, res) => {
    const userId = new ObjectId(req.session.user._id);
    const user = await userModel.findById(userId);

    const productPromises = user.cart.map(productId => productModel.findById(productId));
    const products = await Promise.all(productPromises);

    const purchasePromises = user.purchases.map(async purchaseId => {
        const purchase = await purchaseModel.findById(purchaseId);
        const product = await productModel.findById(purchase.productId);
        return { _id: purchase._id, productId: purchase.productId, images: product.images, title: product.title };
    });

    const purchases = await Promise.all(purchasePromises);

    res.render('purchases', { accountType: req.session.user.accountType, products, purchases });
});

module.exports = router;
