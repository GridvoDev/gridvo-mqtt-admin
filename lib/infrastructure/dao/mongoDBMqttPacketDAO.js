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

    getAllTopic(callback) {
        function getTopics(db) {
            return new Promise((resolve, reject) => {
                db.command({
                    distinct: "mqttpacket",
                    key: "topic"
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
        }

        let self = this;

        async function getAllTopic() {
            let db = await self._db;
            let result = await getTopics(db);
            let resultJSON = result.values;
            return resultJSON;
        }

        getAllTopic().then(resultJSON => {
            callback(null, resultJSON);
        }).catch(err => {
            callback(err);
        })
    }

    getPacketsByTopic(topic, options, callback) {
        let queryOperations = {topic: topic};
        let aggregateOperations = [];
        let matchOperations = {$match: {topic}};
        if (options.startTimestamp || options.endTimestamp) {
            queryOperations.timestamp = {};
            matchOperations["$match"].timestamp = {};
            if (options.startTimestamp) {
                let startTime = new Date(options.startTimestamp);
                queryOperations.timestamp["$gte"] = startTime;
                matchOperations["$match"].timestamp["$gte"] = startTime;
            }
            if (options.endTimestamp) {
                let endTime = new Date(options.endTimestamp);
                queryOperations.timestamp["$lte"] = endTime;
                matchOperations["$match"].timestamp["$lte"] = endTime;
            }
        }
        let projectOperations = {
            $project: {
                "_id": 0,
                "topic": 1,
                "payload": 1,
                "messageId": 1,
                "qos": 1,
                "retain": 1,
                "timestamp": 1
            }
        };
        aggregateOperations.push(matchOperations);
        aggregateOperations.push(projectOperations);
        if (options.skip) {
            let skipOperations = {$skip: options.skip};
            aggregateOperations.push(skipOperations);
        }
        if (options.limit) {
            let limitOperations = {$limit: options.limit};
            aggregateOperations.push(limitOperations);
        }
        function getPacketsCount(db) {
            return new Promise((resolve, reject) => {
                db.collection('mqttpacket').count(queryOperations, (err, count) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(count);
                });
            });
        }

        function getPackets(db) {
            return new Promise((resolve, reject) => {
                db.collection('mqttpacket').aggregate(aggregateOperations, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
        }

        let self = this;

        async function getPacketsByTopic() {
            let db = await self._db;
            let count = await getPacketsCount(db);
            let result = await getPackets(db);
            let resultJSON = {
                topic: topic,
                total: count,
                packets: []
            }
            for (let packet of result) {
                delete packet.topic;
                //packet.timestamp = packet.timestamp.getTime();
                resultJSON.packets.push(packet);
            }
            if(options.startTimestamp){
                resultJSON.startTimestamp = options.startTimestamp;
            }
            if(options.endTimestamp){
                resultJSON.endTimestamp = options.endTimestamp;
            }
            return resultJSON;
        }

        getPacketsByTopic().then(resultJSON => {
            callback(null, resultJSON);
        }).catch(err => {
            callback(err);
        })
    }
}


module.exports = DAO;