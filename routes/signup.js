const express = require("express");

const router = express.Router();
const userModel = require("../models/userModel");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    res.render('signup', { notifications: [] });
});

router.post("/", async (req, res) => {
    try {
        const { username, email, accountType, password } = await req.body;
        const userExists = await userModel.findOne({ email });

        if (userExists) {
            let err = new Error('Email is in use');
            err.message = "This email has already been taken"

            return res.render('signup', { notifications: [
                { level: "error", message: err.message }
            ]});
        }

        const user = new userModel({ username, email, accountType, password });
        const savedUser = await user.save();

        req.session.isAuth = true;
        req.session.user = savedUser;

        res.redirect("/");

    } catch(err) {
        res.render("signup", { notifications: [
            { level: "error", message: err.message }
        ]})
    }
});

module.exports = router;
