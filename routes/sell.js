const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const allowAccess = require("./middleware/allowAccess");
const productModel = require("../models/productModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/', auth, allowAccess('producer', 'trader'), async (req, res) => {
    const userId = new ObjectId(req.session.user._id);
    const user = await userModel.findOne({ _id: userId });

    const productPromises = user.products.map(async productId => await productModel.findOne({ _id: productId }));
    const products = await Promise.all(productPromises);

    res.render('sell', { accountType: req.session.user.accountType, products });
});

router.get('/new', auth, allowAccess('producer', 'trader'), async (req, res) => {
    try {
        const product = new productModel({ title: " ", specification: " ", price: 0.00, minQuantity: 1, maxQuantity: 1, });
        const savedProduct = await product.save();

        res.redirect(`/sell/${ savedProduct._id }`);
    } catch(err) {
        const userId = new ObjectId(req.session.user._id);
        const user = await userModel.findOne({ _id: userId });

        const productPromises = user.products.map(async productId =>  await productModel.findOne({ _id: productId }));
        const products = await Promise.all(productPromises);

        res.render("sell", { notifications: [{ level: "error", message: err.message }], accountType: req.session.user.accountType, products });
    }
});

router.get('/:id', auth, allowAccess('producer', 'trader'), async (req, res) => {
    const userId = req.session.user._id;
    const productId = new ObjectId(req.params.id);
    const user = await userModel.findOne({ _id: userId });
    const product = await productModel.findOne({ _id: productId });

    if (!user.products.includes(productId)) {
        await userModel.findByIdAndUpdate({ _id: userId }, { $push: { products: productId }}, { new: true });
    }

    res.render('newProduct', { accountType: req.session.user.accountType, product });
});

router.post('/:id', auth, allowAccess('producer', 'trader'), async (req, res) => {
    try {
        const { title, price, minQuantity, maxQuantity, currency, metric, specification } = await req.body;
        const images = req.body.images.split(",");
        const productId = new ObjectId(req.params.id);

        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { title: title }}, { new: true });
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { price: price }}, { new: true });
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { metric: metric }}, { new: true });
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { images: images }}, { new: true });
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { currency: currency }}, { new: true });
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { minQuantity: minQuantity }}, { new: true });
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { maxQuantity: maxQuantity }}, { new: true });
        await productModel.findByIdAndUpdate({ _id: productId }, { $set: { specification: specification }}, { new: true });

        res.redirect("/sell");
    } catch(err) {
        const productId = new ObjectId(req.params.id);
        const product = await productModel.findOne({ _id: productId });

        res.render('newProduct', { accountType: req.session.user.accountType, notifications: [{ level: "error", message: err.message }], product });
    }
});

router.get('/delete/:id', auth, allowAccess('producer', 'trader'), async (req, res) => {
    try {
        const userId = req.session.user._id;
        const productId = new ObjectId(req.params.id);
        const user = await userModel.findOne({ _id: userId });

        if (user.products.includes(req.params.id)) {
            await userModel.findByIdAndUpdate({ _id: userId }, { $pull: { products: productId } });
        }

        await productModel.findByIdAndDelete(productId);

        res.redirect("/sell");
    } catch(err) {
        return res.redirect("/sell");
    }
});

module.exports = router;