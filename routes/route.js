const axios = require('axios');
const express = require("express");
const auth = require("./middleware/auth")
const userModel = require("../models/userModel")
const purchaseModel = require("../models/purchaseModel");
const deliverySessionModel = require("../models/deliverySessionModel");

const router = express.Router();

router.get('/', async (req, res) => {
    const { driverCoords, producerCoords, consumerCoords } = req.query;

    const url = `http://router.project-osrm.org/route/v1/driving/${ driverCoords? driverCoords + ";": "" }${ producerCoords };${ consumerCoords }?overview=full&geometries=geojson`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.get('/drivers', auth, async (req, res) => {
    const drivers = await userModel.find({ accountType: "driver" }).limit(100).exec();
    res.json(drivers);
});

router.get('/requests/:id', auth, async (req, res) => {
    const driverId = req.params.id;
    const requests = await deliverySessionModel.find({ driverId }).limit(100).exec();

    res.json(requests);
});

router.get('/:id', auth, async (req, res) => {
    const purchaseId = req.params.id;
    const purchase = await purchaseModel.findById(purchaseId);
    const deliverySession = await deliverySessionModel.findOne({ purchaseId: purchase._id });

   const producer = await userModel.findById(deliverySession.fromId);
   const producerLocation = producer.geolocation;

   const consumer = await userModel.findById(deliverySession.consumerId);
   const consumerLocation = consumer.geolocation;

   let driverLocation = "";

    if (deliverySession.driverId) {
       const driver = await userModel.findById(deliverySession.driverId)
       driverLocation = driver.geolocation;
    } else { driverLocation = "" }

    res.json({ producerLocation, driverLocation, consumerLocation });
});

router.post('/:coordinate', auth, async (req, res) => {
    const geolocation = req.params.coordinate;
    const userId = req.session.user._id;

    await userModel.findByIdAndUpdate(userId, { $set: { geolocation }}, { new: true })
});

module.exports = router;
