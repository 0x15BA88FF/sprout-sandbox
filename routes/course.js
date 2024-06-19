const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");
const courseModel = require("../models/courseModel");

const router = express.Router();

router.get('/:id', auth, allowAccess('producer', 'trader', 'driver'), async (req, res) => {
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId);

    res.render('course', { accountType: req.session.user.accountType, course });
});

module.exports = router;
