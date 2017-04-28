'use strict';
const MqttTopicService = require("./mqttTopicService");
const SessionService = require("./sessionService");

let mqttTopicService = null;
function createMqttTopicService(single = true) {
    if (single && mqttTopicService) {
        return mqttTopicService;
    }
    mqttTopicService = new MqttTopicService();
    return mqttTopicService;
};

let sessionService = null;
function createSessionService(single = true) {
    if (single && sessionService) {
        return sessionService;
    }
    sessionService = new SessionService();
    return sessionService;
};

module.exports = {
    createMqttTopicService,
    createSessionService
};