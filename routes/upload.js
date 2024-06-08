const path = require('path');
const express = require("express");
const auth = require("./middleware/auth");
const uploader = require('./middleware/uploadFile');

const router = express.Router();
const upload = uploader(path.join(__dirname, '../uploads'));

router.post('/', auth, upload.single('files'), (req, res, next) => {
    const file = req.file;

    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    let filename = file.path.split('\\').pop();
    res.json(filename);
});

module.exports = router;