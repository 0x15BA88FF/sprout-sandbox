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

    const cartProductPromises = user.cart.map(async productId => {
        const product = await productModel.findById(productId);
        if (product) { return { _id: product._id, images: product.images, title: product.title } }
    });

    const purchasePromises = user.purchases.map(async purchaseId => {
        try {
            const purchase = await purchaseModel.findById(purchaseId);
            const product = await productModel.findById(purchase.productId);

            return { _id: purchase._id, productId: purchase.productId, images: product.images, title: product.title }
            // if (purchase || product) { return { _id: purchase._id, productId: purchase.productId, images: product.images, title: product.title } }
        } catch (err) { console.log(err) }
    });

    const cartProducts = (await Promise.all(cartProductPromises)).filter(product => product != undefined);
    const purchases = (await Promise.all(purchasePromises)).filter(product => product != undefined);

    res.render('purchases', { accountType: req.session.user.accountType, products: cartProducts, purchases });
});

module.exports = router;
