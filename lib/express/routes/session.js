'use strict';
const _ = require('underscore');
const express = require('express');
const {errCodeTable} = require('../util');
const {logger} = require('../../util');

let router = express.Router();
router.get("/", (req, res) => {
    let {skip, limit} = req.query;
    let resultJSON = {};
    let sessionService = req.app.get('sessionService');
    if (skip) {
        skip = parseInt(skip);
    }
    if (limit) {
        limit = parseInt(limit);
    }
    let options = {skip, limit};
    sessionService.getSessions(options, (err, result) => {
        if (err) {
            logger.error(err.message);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.result = result;
        res.json(resultJSON);
        logger.info(`get sessions:${result.sessions.length} success`);
    });
});

module.exports = router;