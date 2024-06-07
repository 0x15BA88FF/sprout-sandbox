const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const reviewModel = require("../models/reviewModel");
const allowAccess = require("./middleware/allowAccess");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.post('/:id', auth, allowAccess('consumer', 'trader'), async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = new ObjectId(req.params.id);
        const fromId = req.session.user._id;

        const review = new reviewModel({ fromId, rating, comment });
        const savedReview = await review.save();
        const product = await productModel.findById(productId);

        const reviewPromises = product.reviews.map(reviewId => reviewModel.findOne({ _id: reviewId }));
        const reviews = await Promise.all(reviewPromises);
        const ratings = reviews.map(review => review.rating);
        const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

        let updatedProduct = await productModel.findByIdAndUpdate({ _id: productId }, { $push: { reviews: savedReview._id }}, { new: true });
        updatedProduct = await productModel.findByIdAndUpdate({ _id: productId }, { $set: { rating: averageRating }}, { new: true });
        return res.redirect(`/purchase/${ productId }`);

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
