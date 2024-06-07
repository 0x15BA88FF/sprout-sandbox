const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel")
const productsModel = require("../models/productModel")

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const { accountType } = req.session.user;
    let { search, category, filter } = req.query;

    if (!search) { search = "" }
    if (!category) { category = "" }

    let products = [];
    let producers = [];
    let traders = [];
    let drivers = [];

    if (accountType === 'producer' || accountType === 'trader') {
        return res.render('dashboard', {
            accountType: req.session.user.accountType,
        });
    } else {
        if (search) {
            try {
                producers = await userModel.find({ $and: [{ username: { $regex: new RegExp(search, 'i') }}, { accountType: "producer" }]}).sort({ rating: -1 }).limit(10).exec();
                traders = await userModel.find({ $and: [{ username: { $regex: new RegExp(search, 'i') } }, { accountType: "trader" }]}).sort({ rating: -1 }).limit(10).exec();
                drivers = await userModel.find({ $and: [{ username: { $regex: new RegExp(search, 'i') }}, { accountType: "driver" }]}).sort({ rating: -1 }).limit(10).exec();
                products = await productsModel.find({ $and: [{ title: { $regex: new RegExp(search, 'i') }}] }).sort({ rating: -1 }).limit(10).exec();

            } catch (error) { console.error('Error fetching:', error); }
        } else if (category) {
            try { products = await productsModel.find({ $and: [{ category: { $regex: new RegExp(category, 'i') } }] }).sort({ rating: -1 }).limit(10).exec() }
            catch (error) { console.error('Error fetching:', error); }
        } else {
            if (filter === 'producer') {
                try {
                    producers = await userModel.find({ $and: [{ accountType: "producer" }] }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error); }
            } else if (filter === 'trader') {
                try {
                    traders = await userModel.find({ $and: [{ accountType: "trader" }] }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error); }
            } else if (filter === 'driver') {
                try {
                    drivers = await userModel.find({ $and: [{ accountType: "driver" }] }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error); }
            } else {
                try {
                    products = await productsModel.find({ }).sort({ rating: -1 }).limit(10).exec();
                } catch (error) { console.error('Error fetching:', error); }
            }
        }

        res.render('buy', { category, accountType: req.session.user.accountType, products, producers, traders, drivers });
    }
});

module.exports = router;