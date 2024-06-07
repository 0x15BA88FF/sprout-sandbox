const express = require("express");
const mongodb = require('mongodb');
const auth = require("./middleware/auth");
const allowAccess = require("./middleware/allowAccess");
const courseModel = require("../models/courseModel");

const router = express.Router();
const ObjectId = mongodb.ObjectId;

router.get('/:id', auth, allowAccess('producer', 'trader', 'agent'), async (req, res) => {
    const courseId = new ObjectId(req.params.id);
    const course = await courseModel.findOne({ _id: courseId });

    res.render('course', { accountType: req.session.user.accountType, course });
});

module.exports = router;
