const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")

const router = express.Router();

router.get('/', auth, async (req, res) => {
    let { search, category, filter } = req.query;

    if (!search) { search = "" }
    if (!category) { category = "" }

    let productsPromise, producersPromise, tradersPromise, driversPromise;
    if (req.session.user.accountType === 'driver') {
        res.render('map', { id: req.session.user._id, accountType: req.session.user.accountType });
    } else {
        if (search) {
            productsPromise = productModel.find({ title: { $regex: new RegExp(search, 'i') } }).sort({ rating: -1 }).limit(10);
            driversPromise = userModel.find({ username: { $regex: new RegExp(search, 'i') }, accountType: "driver" }).sort({ rating: -1 }).limit(10);
            tradersPromise = userModel.find({ username: { $regex: new RegExp(search, 'i') }, accountType: "trader" }).sort({ rating: -1 }).limit(10);
            producersPromise = userModel.find({ username: { $regex: new RegExp(search, 'i') }, accountType: "producer" }).sort({ rating: -1, dateCreated: -1 }).limit(10);
        } else if (category) {
            productsPromise = productModel.find({ category: { $regex: new RegExp(category, 'i') } }).sort({ rating: -1, dateCreated: -1 }).limit(10);
        } else {
            if (filter === 'producer') {
                producersPromise = userModel.find({ accountType: "producer" }).sort({ rating: -1 }).limit(10);
            } else if (filter === 'trader') {
                tradersPromise = userModel.find({ accountType: "trader" }).sort({ rating: -1 }).limit(10);
            } else if (filter === 'driver') {
                driversPromise = userModel.find({ accountType: "driver" }).sort({ rating: -1 }).limit(10);
            } else {
                productsPromise = productModel.find({}).sort({ rating: -1, dateCreated: -1 }).limit(10);
            }
        }
    
        const [products = [], producers = [], traders = [], drivers = []] = await Promise.all([productsPromise, producersPromise, tradersPromise, driversPromise]);
    
        res.render('buy', { accountType: req.session.user.accountType, products, producers, traders, drivers });
    };
});

module.exports = router;
