'use strict';
const _ = require('underscore');
const {createSessionDAO} = require('../../infrastructure');

class Service {
    constructor() {
        this._sessionDAO = createSessionDAO();
    }

    getSessions(options, callback) {
        this._sessionDAO.getSessions(options, (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, result);
        });
    }
}

module.exports = Service;