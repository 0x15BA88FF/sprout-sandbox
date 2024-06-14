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
    const user = await userModel.findById(userId);

    const productPromises = user.products.map(async productId => await productModel.findById(productId));
    const products = await Promise.all(productPromises);

    res.render('sell', { accountType: req.session.user.accountType, products });
});

router.get('/new', auth, allowAccess('producer', 'trader'), async (req, res) => {
    try {
        const product = new productModel({ title: " ", specification: " ", price: 0.00, minQuantity: 1, quantity: 1, });
        const savedProduct = await product.save();

        res.redirect(`/sell/${ savedProduct._id }`);
    } catch(err) {
        const userId = new ObjectId(req.session.user._id);
        const user = await userModel.findById(userId);

        const productPromises = user.products.map(async productId =>  await productModel.findById(productId));
        const products = await Promise.all(productPromises);

        res.render("sell", { notifications: [{ level: "error", message: err.message }], accountType: req.session.user.accountType, products });
    }
});

router.get('/:id', auth, allowAccess('producer', 'trader'), async (req, res) => {
    const userId = req.session.user._id;
    const productId = new ObjectId(req.params.id);
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!user.products.includes(productId)) {
        await userModel.findByIdAndUpdate({ _id: userId }, { $push: { products: productId }}, { new: true });
    }

    res.render('newProduct', { accountType: req.session.user.accountType, product });
});

router.post('/:id', auth, allowAccess('producer', 'trader'), async (req, res) => {
    try {
        const { title, category, price, minQuantity, quantity, currency, metric, specification } = await req.body;
        const images = req.body.images.split(",");
        const productId = new ObjectId(req.params.id);

        await productModel.findByIdAndUpdate(productId, { $set: { title }});
        await productModel.findByIdAndUpdate(productId, { $set: { category }});
        await productModel.findByIdAndUpdate(productId, { $set: { price }});
        await productModel.findByIdAndUpdate(productId, { $set: { metric }});
        await productModel.findByIdAndUpdate(productId, { $set: { images }});
        await productModel.findByIdAndUpdate(productId, { $set: { currency }});
        await productModel.findByIdAndUpdate(productId, { $set: { minQuantity }});
        await productModel.findByIdAndUpdate(productId, { $set: { quantity }});
        await productModel.findByIdAndUpdate(productId, { $set: { specification }});

        res.redirect("/sell");
    } catch(err) {
        const productId = new ObjectId(req.params.id);
        const product = await productModel.findById(productId);

        res.render('newProduct', { accountType: req.session.user.accountType, notifications: [{ level: "error", message: err.message }], product });
    }
});

router.get('/delete/:id', auth, allowAccess('producer', 'trader'), async (req, res) => {
    try {
        const userId = req.session.user._id;
        const productId = new ObjectId(req.params.id);
        const user = await userModel.findById(userId);

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
