const path = require('path');
const express = require("express");
const auth = require("./middleware/auth");
const uploader = require('./middleware/uploadFile');

const router = express.Router();
const upload = uploader(path.join(__dirname, '../uploads'));

router.post('/', auth, upload.array('files', maxCount = undefined), (req, res) => {
    res.send('Files uploaded successfully');
});

router.get('/', (req, res) => {
    res.render('upload');
});

module.exports = router;