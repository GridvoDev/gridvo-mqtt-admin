'use strict';
const MongoDBMqttPacketDAO = require("./mongoDBMqttPacketDAO");

let mqttPacketDAO = null;
function createMqttPacketDAO(single = true) {
    if (single && mqttPacketDAO) {
        return mqttPacketDAO;
    }
    mqttPacketDAO = new MongoDBMqttPacketDAO();
    return mqttPacketDAO;
};

module.exports = {
    createMqttPacketDAO
};