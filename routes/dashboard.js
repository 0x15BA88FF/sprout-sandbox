const express = require("express");
const auth = require("./middleware/auth");
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const purchaseModel = require("../models/purchaseModel")

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const userId = req.session.user._id;
    let { search, category, filter } = req.query;

    if (!search) { search = "" }
    if (!category) { category = "" }

    const user = await userModel.findById(userId);

    const productsPromises = user.products.map(async productId => await productModel.findById(productId));
    const products = await Promise.all(productsPromises);

    const incomePromises = user.products.map(async productId => {
        const purchases = await purchaseModel.find({ productId });
        const product = await productModel.findById(productId);

        const salesPromises = purchases.map(data => data.quantity);
        const salesData = await Promise.all(salesPromises);
        let sales = salesData.reduce((acc, quantity) => acc + quantity, 0);
        let income = sales * product.price;

        return income;
    });

    const salesPromises = user.products.map(async productId => {
        const purchases = await purchaseModel.find({ productId });

        const salesPromises = purchases.map(data => data.quantity);
        const salesData = await Promise.all(salesPromises);
        let sales = salesData.reduce((acc, quantity) => acc + quantity, 0);

        return sales;
    });

    const salesData = await Promise.all(salesPromises);
    const incomeData = await Promise.all(incomePromises);

    const sales = salesData.reduce((acc, quantity) => acc + quantity, 0);
    const income = incomeData.reduce((acc, price) => acc + price, 0);

    return res.render('dashboard', { accountType: req.session.user.accountType, products, sales: sales, income });
});

module.exports = router;
