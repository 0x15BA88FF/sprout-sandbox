const express = require('express');
const moment = require('moment');
const mongodb = require('mongodb');
const productModel = require("../models/productModel");
const purchaseModel = require("../models/purchaseModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get("/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const sevenDaysAgo = moment().subtract(7, 'days').toDate();
        const purchases = await purchaseModel.find({ $and: [ { productId: productId }, { date: { $gte: sevenDaysAgo }} ]});

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
