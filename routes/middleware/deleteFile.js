const fs = require('fs');

module.exports = (filePath) => {
    return function(req, res, next) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${ err.message }`);
                return res.status(500).send('Error deleting file');
            }
            console.log(`File deleted: ${ filePath }`);
            next();
        });
    };
}
