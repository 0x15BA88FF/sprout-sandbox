const express = require("express");
const auth = require("./middleware/auth")
const deliverySessionModel = require("../models/deliverySessionModel");

const router = express.Router();

router.post('/request/:id', auth, async (req, res) => {
    try {
        const deliverySessionId = req.params.id;
        const driverId = req.body.id;

        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { driverId });
        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { isActive: false });

        res.status(200).send("Request made successfully");
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.post('/accept/:id', auth, async (req, res) => {
    try {
        const deliverySessionId = req.params.id;
        const driverId = req.body.id;

        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { driverId });
        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { isActive: true });

        res.status(200).send("deliver session activated successfully");
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.delete('/request/:id', auth, async (req, res) => {
    try {
        const deliverySessionId = req.params.id;

        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { driverId: "" });
        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { isActive: false });

        res.status(200).send("Request deleted successfully");
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.delete('/cancel/:id', auth, async (req, res) => {
    try {
        const deliverySessionId = req.params.id;

        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { driverId: "" });
        await deliverySessionModel.findByIdAndUpdate(deliverySessionId, { isActive: false });

        res.status(200).send("deliver session activated successfully");
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;
