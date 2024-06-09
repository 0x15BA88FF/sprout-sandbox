const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const { accountType } = req.session.user;
    const userId = req.session.user._id;
    let { search, category, filter } = req.query;

    if (!search) { search = "" }
    if (!category) { category = "" }

    let products = [];
    let producers = [];
    let traders = [];
    let drivers = [];

    if (accountType === 'producer' || accountType === 'trader') {
        const user = await userModel.findById(userId);
        const productsPromises = user.products.map(async productId => await productModel.findById(productId));
        const products = await Promise.all(productsPromises);
        return res.render('dashboard', { accountType: req.session.user.accountType, products, sales: "256", profit: '100k' });
    } else {
        if (search) {
            try {
                products = await productModel.find({ $and: [{ title: { $regex: new RegExp(search, 'i') }}] }).sort({ rating: -1 }).limit(10).exec();
                drivers = await userModel.find({ $and: [{ username: { $regex: new RegExp(search, 'i') }}, { accountType: "driver" }]}).sort({ rating: -1 }).limit(10).exec();
                traders = await userModel.find({ $and: [{ username: { $regex: new RegExp(search, 'i') } }, { accountType: "trader" }]}).sort({ rating: -1 }).limit(10).exec();
                producers = await userModel.find({ $and: [{ username: { $regex: new RegExp(search, 'i') }}, { accountType: "producer" }]}).sort({ rating: -1 }).limit(10).exec();
            } catch (error) { console.error('Error fetching:', error); }
        } else if (category) {
            try { products = await productModel.find({ $and: [{ category: { $regex: new RegExp(category, 'i') } }] }).sort({ rating: -1 }).limit(10).exec() }
            catch (error) { console.error('Error fetching:', error) }
        } else {
            if (filter === 'producer') {
                try {
                    producers = await userModel.find({ $and: [{ accountType: "producer" }] }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error) }
            } else if (filter === 'trader') {
                try {
                    traders = await userModel.find({ $and: [{ accountType: "trader" }] }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error) }
            } else if (filter === 'driver') {
                try {
                    drivers = await userModel.find({ $and: [{ accountType: "driver" }] }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error) }
            } else {
                try {
                    products = await productModel.find({ }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error) }
            }
        }

        res.render('buy', { category, accountType: req.session.user.accountType, products, producers, traders, drivers });
    }
});

module.exports = router;