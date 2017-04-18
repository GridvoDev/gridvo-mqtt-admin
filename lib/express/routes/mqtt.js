'use strict';
const _ = require('underscore');
const express = require('express');
const {errCodeTable} = require('../util');
const {logger} = require('../../util');

let router = express.Router();
router.get("/packets", (req, res) => {
    let {topic, startTimestamp, endTimestamp, skip, limit} = req.query;
    let resultJSON = {};
    if (!topic) {
        resultJSON.errcode = errCodeTable.FAIL.errCode;
        resultJSON.errmsg = errCodeTable.FAIL.errMsg;
        res.json(resultJSON);
        logger.error(`get mqtt packets by topic:${topic} fail`);
        return;
    }
    let mqttTopicService = req.app.get('mqttTopicService');
    if (startTimestamp) {
        startTimestamp = parseInt(startTimestamp);
    }
    if (endTimestamp) {
        endTimestamp = parseInt(endTimestamp);
    }
    if (skip) {
        skip = parseInt(skip);
    }
    if (limit) {
        limit = parseInt(limit);
    }
    let options = {startTimestamp, endTimestamp, skip, limit};
    mqttTopicService.getMqttPacketsByTopic(topic, options, (err, mqttPackets) => {
        if (err) {
            logger.error(err.message);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.result = mqttPackets;
        res.json(resultJSON);
        logger.info(`get mqtt packets by topic:${topic} success`);
    });
});

router.get("/topic-tree", (req, res) => {
    let resultJSON = {};
    let mqttTopicService = req.app.get('mqttTopicService');
    mqttTopicService.getTopicTree((err, topicTree) => {
        if (err) {
            logger.error(err.message);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.result = topicTree;
        res.json(resultJSON);
        logger.info(`get mqtt topic tree success`);
    });
});

module.exports = router;