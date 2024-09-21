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
        if (!deliverySession) {
            return res.status(404).json({ error: 'Delivery session not found' });
        }

        const drivers = await userModel.find({ accountType: "driver" }).limit(100).exec();
        const producer = await userModel.findById(deliverySession.fromId);
        const consumer = await userModel.findById(deliverySession.consumerId);

        if (!producer || !consumer) {
            return res.status(404).json({ error: 'Producer or consumer not found' });
        }

        const producerLocation = producer.geolocation;
        const consumerLocation = consumer.geolocation;

        const driverPromises = drivers.map(async driver => {
            try {
                const driverLocation = driver.geolocation;
                const isRequested = String(driver._id) === deliverySession.driverId;
                const route = await axios.get(`http://router.project-osrm.org/route/v1/driving/${driverLocation};${producerLocation};${consumerLocation}?overview=full&geometries=geojson`);
                
                if (!route.data.routes || route.data.routes.length === 0) {
                    console.warn(`No routes found for driver ${driver._id}`);
                    return null;
                }
                
                return {
                    _id: driver._id,
                    username: driver.username,
                    avatar: driver.avatar,
                    geolocation: driver.geolocation,
                    vehicleImages: driver.vehicleImages,
                    distance: route.data.routes[0].distance,
                    isRequested
                };
            } catch (error) {
                console.error(`Error fetching route for driver ${driver._id}:`, error.message);
                return null;
            }
        });

        const driversData = (await Promise.all(driverPromises)).filter(data => data !== null);

        res.json({ driverData: driversData, isActive: deliverySession.isActive });
    } catch (error) {
        console.error('Error handling /drivers/:id request:', error);
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
