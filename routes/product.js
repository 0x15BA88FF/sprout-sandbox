const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");
const productModel = require("../models/productModel");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/:id', auth, allowAccess('trader', 'producer', 'consumer'), async (req, res) => {
    const productId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.session.user._id);

    const product = await productModel.findById(productId);
    const user = await userModel.findById(userId);
    const author = await userModel.findOne({ products: { $in: [productId] }}).exec();
    const products = await productModel.find({ }).sort({ rating: -1 }).limit(10).exec();

    let isInCart = false;
    if (user.cart.includes(productId)) { isInCart = true }

    const reviewPromises = product.reviews.map(async reviewId => {
        const review = await reviewModel.findById(reviewId);
        const user = await userModel.findById(review.fromId);
        return { _id: review._id, fromId: review.fromId, username: user.username, rating: review.rating, comment: review.comment };
    });

    const reviews = await Promise.all(reviewPromises);

    res.render('product', { accountType: req.session.user.accountType, product, author, products, reviews, isInCart });
});

module.exports = router;