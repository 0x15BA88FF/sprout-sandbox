const fs = require('fs');
const cors=require("cors");
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const notFound = require('./routes/middleware/notFound');
const serverError = require('./routes/middleware/serverError');

const app = express();
const port = 3000 || process.env.PORT;
const MONGOURI = "mongodb://localhost:27017/SPROUTCLUSERS";
const mongoDBSession = require("connect-mongodb-session")(session);
const store = new mongoDBSession({ uri: MONGOURI, collection: "userSessions" });

mongoose.connect(MONGOURI)
        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => console.error('MongoDB connection error:\n', err));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: "q7yuh35ntfwev-sdii32ohrfe7d7sugar",
    resave: false,
    saveUninitialized: false,
    store: store
}));

const routesDirectory = path.join(__dirname, 'routes');

fs.readdirSync(routesDirectory).forEach(file => {
    if (file.endsWith('.js')) {
        const filename = file.slice(0, -3);
        const route = require(path.join(routesDirectory, file));

        switch (filename) {
            case 'index':
                app.use("/", route);
                break;
            default:
                if (typeof route === 'function') { app.use(`/${ filename }`, route) }
                else { console.error(`Invalid route handler in ${ file }.`) }
                break;
        }

    }
});

app.use(notFound)
app.use(serverError)

app.listen(port, () => console.log(`Server listening on port ${ port }`));

