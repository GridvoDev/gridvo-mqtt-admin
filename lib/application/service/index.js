'use strict';
const MqttTopicService = require("./mqttTopicService");

let mqttTopicService = null;
function createMqttTopicService(single = true) {
    if (single && mqttTopicService) {
        return mqttTopicService;
    }
    mqttTopicService = new MqttTopicService();
    return mqttTopicService;
};

module.exports = {
    createMqttTopicService
};