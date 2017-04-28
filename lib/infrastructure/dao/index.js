'use strict';
const MongoDBMqttPacketDAO = require("./mongoDBMqttPacketDAO");
const MongoDBSessionDAO = require("./mongoDBSessionDAO");

let mqttPacketDAO = null;
function createMqttPacketDAO(single = true) {
    if (single && mqttPacketDAO) {
        return mqttPacketDAO;
    }
    mqttPacketDAO = new MongoDBMqttPacketDAO();
    return mqttPacketDAO;
};

let sessionDAO = null;
function createSessionDAO(single = true) {
    if (single && sessionDAO) {
        return sessionDAO;
    }
    sessionDAO = new MongoDBSessionDAO();
    return sessionDAO;
};

module.exports = {
    createMqttPacketDAO,
    createSessionDAO
};