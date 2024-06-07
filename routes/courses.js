const express = require("express");
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");
const courseModel = require("../models/courseModel");

const router = express.Router();

router.get('/', auth, allowAccess('producer', 'trader', 'agent'), async (req, res) => {
    const courses = await courseModel.find({ }).exec();

    res.render('courses', { accountType: req.session.user.accountType, courses });
});

module.exports = router;
