const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const allowAccess = require("./middleware/allowAccess");
const purchaseModel = require("../models/purchaseModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/:id', auth, allowAccess('producer', 'consumer', 'trader'), async (req, res) => {
    const productId = new ObjectId(req.params.id);
    const product = await productModel.findById(productId);
    const author = await userModel.findOne({ products: { $in: [productId] }}).exec();

    res.render('purchase', { accountType: req.session.user.accountType, product, author });
});

router.post('/:productId', auth, allowAccess('producer', 'consumer', 'trader'), async (req, res) => {
    try {
        const productId = req.params.productId;
        const { quantity } = await req.body;

        await productModel.findByIdAndUpdate(productId, { $inc: { quantity: - quantity } }, { new: true });

        const purchase = new purchaseModel({ productId, quantity });
        await purchase.save();

        res.redirect("/");
    } catch(err) {
        const productId = new ObjectId(req.params.id);
        const product = await productModel.findById(productId);
        const author = await userModel.findOne({ products: { $in: [productId] }}).exec();

        res.render('purchase', { accountType: req.session.user.accountType, product, author, notifications: [{ level: "error", message: err.message }] });
    }
});

module.exports = router;
