'use strict';
const express = require('express');
const {logger} = require('./lib/util');
const {mqttRouter} = require('./lib/express');
const {createMqttTopicService} = require('./lib/application');

let app;
app = express();
app.use('/mqtt', mqttRouter);
let mqttTopicService = createMqttTopicService();
app.set('mqttTopicService', mqttTopicService);
app.listen(3001, (err) => {
    if (err) {
        logger.error(err.message);
    }
    else {
        logger.info("express server is starting");
    }
});