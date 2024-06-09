const express = require('express');
const moment = require('moment');
const productModel = require("../models/productModel");
const purchaseModel = require("../models/purchaseModel");

const router = express.Router();

router.get("/:name", async (req, res) => {
    const search = req.params.name;

    try {
        const sevenDaysAgo = moment().subtract(7, 'days').toDate();
        const products = await productModel.find({ title: { $regex: new RegExp(search, 'i') } }).exec();
        const productIds = products.map(product => product._id);
        const purchases = await purchaseModel.find({ $and: [ { productId: { $in: productIds } }, { date: { $gte: sevenDaysAgo }} ]}).exec();

        const quantitiesByDay = new Array(7).fill(0);

        purchases.forEach(purchase => {
            const dayIndex = 6 - moment().diff(moment(purchase.date).startOf('day'), 'days');
            if (dayIndex >= 0 && dayIndex < 7) {
                quantitiesByDay[dayIndex] += purchase.quantity;
            }
        });

        res.json(quantitiesByDay);
    } catch (error) {
        console.error('Error fetching recent items:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
