'use strict';
const express = require('express');
const {logger} = require('./lib/util');
const {mqttRouter} = require('./lib/express');
const {createMqttTopicService} = require('./lib/application');

let app;
app = express();
app.use("/", express.static(__dirname + "/lib/express/publish"));
app.use('/mqtt', mqttRouter);
let mqttTopicService = createMqttTopicService();
app.set('mqttTopicService', mqttTopicService);
app.listen(9191, (err) => {
    if (err) {
        logger.error(err.message);
    }
    else {
        logger.info("express server is starting");
    }
});