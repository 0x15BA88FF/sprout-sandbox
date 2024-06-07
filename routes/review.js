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

        const updatedProduct = await productModel.findByIdAndUpdate( { _id: productId }, { $push: { reviews: savedReview._id } }, { new: true });
        return res.redirect(`/purchase/${ productId }`);

    } catch(err) {
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

        res.render('purchase', { accountType: req.session.user.accountType, product, author, products, reviews, rating, notifications: [{ level: "error", message: err.message }] });
    }
});

module.exports = router;
