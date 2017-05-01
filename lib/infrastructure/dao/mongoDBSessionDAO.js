'use strict';
const _ = require('underscore');
const MongoClient = require('mongodb').MongoClient;

class DAO {

    constructor() {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"} = process.env;
        this._dbURL = `mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/GridvoMqtt`;
        this._db = this._connect();
    }

    _connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this._dbURL, (err, db) => {
                if (err) {
                    reject(err);
                }
                resolve(db);
            });
        });
    }

    close() {
        this._db.then(db => {
            db.close();
        });
    }

    getSessions(options, callback) {
        let queryOperations = {};
        let aggregateOperations = [];
        let projectOperations = {
            $project: {
                "_id": 0,
                "serverID": 1,
                "clientID": 1,
                "loginTime": 1
            }
        };
        aggregateOperations.push(projectOperations);
        if (options.skip) {
            let skipOperations = {$skip: options.skip};
            aggregateOperations.push(skipOperations);
        }
        if (options.limit) {
            let limitOperations = {$limit: options.limit};
            aggregateOperations.push(limitOperations);
        }
        function getSessionsCount(db) {
            return new Promise((resolve, reject) => {
                db.collection('session').count(queryOperations, (err, count) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(count);
                });
            });
        }

        function getSessionsByOptions(db) {
            return new Promise((resolve, reject) => {
                db.collection('session').aggregate(aggregateOperations, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
        }

        let self = this;

        async function getSessions() {
            let db = await self._db;
            let count = await getSessionsCount(db);
            let result = await getSessionsByOptions(db);
            let resultJSON = {
                total: count,
                sessions: result
            }
            return resultJSON;
        }

        getSessions().then(resultJSON => {
            callback(null, resultJSON);
        }).catch(err => {
            callback(err);
        })
    }
}


module.exports = DAO;