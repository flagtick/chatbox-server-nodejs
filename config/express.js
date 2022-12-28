const path = require('path'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    routers = require('../routes/router'),
    cors = require('cors');

module.exports.init = () => {
    const app = express();
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());

    app.use("/api/message", routers);
    
    return app;
}