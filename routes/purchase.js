const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const productModel = require("../models/productModel");
const allowAccess = require("./middleware/allowAccess");
const purchaseModel = require("../models/purchaseModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/:id', auth, allowAccess('consumer', 'trader'), async (req, res) => {
    const productId = new ObjectId(req.params.id);
    const product = await productModel.findOne({ _id: productId });
    const author = await userModel.findOne({ products: { $in: [productId] }}).exec();
    const products = await productModel.find({ }).sort({ rating: -1 }).limit(10).exec();

    const reviewPromises = product.reviews.map(async reviewId => {
        const review = await reviewModel.findById(reviewId);
        const user = await userModel.findById(review.fromId);
        return { _id: review._id, fromId: review.fromId, username: user.username, rating: review.rating, comment: review.comment };
    });
    const reviews = await Promise.all(reviewPromises);

    const ratings = reviews.map(review => review.rating);
    const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0);
    const rating = totalRatings / ratings.length;

    res.render('purchase', { accountType: req.session.user.accountType, product, author, products, reviews, rating });
});

router.post('/:productId', auth, allowAccess('consumer', 'trader'), async (req, res) => {
    try {
        const productId = req.params.productId;
        const { quantity } = await req.body;

        const purchase = new purchaseModel({ productId, quantity });
        const savedPurchase = await purchase.save();

        res.redirect("/");

    } catch(err) {
        const productId = new ObjectId(req.params.id);
        const product = await productModel.findOne({ _id: productId });
        const author = await userModel.findOne({ products: { $in: [productId] }}).exec();
        const products = await productModel.find({ }).sort({ rating: -1 }).limit(10).exec();

        const reviewPromises = product.reviews.map(reviewId => reviewModel.findOne({ _id: reviewId }));
        const reviews = await Promise.all(reviewPromises);

        res.render('purchase', { accountType: req.session.user.accountType, product, author, products, reviews, notifications: [{ level: "error", message: err.message }] });
    }
});

module.exports = router;