'use strict';
const express = require('express');
const {logger} = require('./lib/util');
const {mqttRouter, sessionRouter} = require('./lib/express');
const {createMqttTopicService, createSessionService} = require('./lib/application');

let app;
app = express();
app.use("/", express.static(__dirname + "/lib/express/publish"));
app.use('/mqtt', mqttRouter);
app.use('/sessions', sessionRouter);
let mqttTopicService = createMqttTopicService();
app.set('mqttTopicService', mqttTopicService);
let sessionService = createSessionService();
app.set('sessionService', sessionService);
app.listen(9191, (err) => {
    if (err) {
        logger.error(err.message);
    }
    else {
        logger.info("express server is starting");
    }
});