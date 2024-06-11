const axios = require('axios');
const express = require("express");

const router = express.Router();

router.get('/', async (req, res) => {
    const { start, end } = req.query;
    const url = `http://router.project-osrm.org/route/v1/driving/${ start };${ end }?overview=full&geometries=geojson`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;
