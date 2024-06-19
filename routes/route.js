const axios = require('axios');
const express = require("express");
const auth = require("./middleware/auth")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
const purchaseModel = require("../models/purchaseModel")
const deliverySessionModel = require("../models/deliverySessionModel");

const router = express.Router();

router.get('/drivers/:id', auth, async (req, res) => {
    try {
        const deliverySessionId = req.params.id;
        const deliverySession = await deliverySessionModel.findById(deliverySessionId);

        const drivers = await userModel.find({ accountType: "driver" }).limit(100).exec();
        const producer = await userModel.findById(deliverySession.fromId);
        const consumer = await userModel.findById(deliverySession.consumerId);

        const producerLocation = producer.geolocation;
        const consumerLocation = consumer.geolocation;

        const driverPromises = drivers.map(async driver => {
            const driverLocation = driver.geolocation;
            const isRequested = String(driver._id) === deliverySession.driverId;
            const route = await axios.get(`http://router.project-osrm.org/route/v1/driving/${ driverLocation };${ producerLocation };${ consumerLocation }?overview=full&geometries=geojson`);
            return { _id: driver._id, username: driver.username, avatar: driver.avatar, geolocation: driver.geolocation, distance: route.data.routes[0].distance, isRequested }
        });
        const driversData = await Promise.all(driverPromises);

        res.json({ driverData: driversData, isActive: deliverySession.isActive });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.get('/requests/:id', auth, async (req, res) => {
    const driverId = req.params.id;
    try {
        const requests = await deliverySessionModel.find({ driverId }).limit(100).exec()

        const deliverySessionPromise = requests.map(async deliverySession => {
            const producer = await userModel.findById(deliverySession.fromId);
            const driver = await userModel.findById(deliverySession.driverId);
            const consumer = await userModel.findById(deliverySession.consumerId);
            const purchase = await purchaseModel.findById(deliverySession.purchaseId);
            const product = await productModel.findById(purchase.productId);

            const producerLocation = producer.geolocation;
            const consumerLocation = consumer.geolocation;
            const driverLocation = driver.geolocation;

            const route = await axios.get(`http://router.project-osrm.org/route/v1/driving/${ driverLocation };${ producerLocation };${ consumerLocation }?overview=full&geometries=geojson`);
            return { _id: deliverySession._id, title: product.title, thumbnail: product.images[0], distance: route.data.routes[0].distance }
        });
        const deliverySessions = await Promise.all(deliverySessionPromise);

        res.json(deliverySessions);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


router.get('/:id', auth, async (req, res) => {
    const deliverySessionId = req.params.id;
    const deliverySession = await deliverySessionModel.findById(deliverySessionId);

    const producer = await userModel.findById(deliverySession.fromId);
    const producerLocation = producer.geolocation;

    const consumer = await userModel.findById(deliverySession.consumerId);
    const consumerLocation = consumer.geolocation;

    let driverLocation = "";

    if (deliverySession.driverId) {
        const driver = await userModel.findById(deliverySession.fromId);
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
