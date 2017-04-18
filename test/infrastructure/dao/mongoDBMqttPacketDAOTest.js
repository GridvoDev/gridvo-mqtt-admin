'use strict';
const MongoClient = require('mongodb').MongoClient;
const _ = require('underscore');
const should = require('should');
const mongoDBMqttPacketDAO = require('../../../lib/infrastructure/dao/mongoDBMqttPacketDAO');

describe('mongoDBMqttPacketDAO use case test', () => {
    let DAO;
    before(() => {
        DAO = new mongoDBMqttPacketDAO();
    });
    describe('#getAllTopic(callback)', () => {
        context('get all mqtt packet topic', () => {
            before(done => {
                let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"} = process.env;
                MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/GridvoMqtt`, (err, db) => {
                    if (err) {
                        done(err);
                    }
                    let insertOperations = [{
                        topic: "topic1",
                        payload: "payload",
                        messageId: "messageId",
                        qos: 0,
                        retain: false,
                        timestamp: new Date((new Date()).getTime() - 1000 * 60 * 3)
                    }, {
                        topic: "topic1",
                        payload: "payload",
                        messageId: "messageId",
                        qos: 0,
                        retain: false,
                        timestamp: new Date((new Date()).getTime() - 1000 * 60 * 2)
                    }, {
                        topic: "topic2",
                        payload: "payload",
                        messageId: "messageId",
                        qos: 0,
                        retain: false,
                        timestamp: new Date((new Date()).getTime() - 1000 * 60)
                    }];
                    db.collection('mqttpacket').insertMany(insertOperations, (err, result) => {
                        if (err) {
                            done(err);
                        }
                        db.close();
                        done();
                    });
                });
            });
            it('return all topic is ok', done => {
                DAO.getAllTopic((err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    resultJSON.length.should.be.eql(2);
                    done();
                });
            });
            after(done => {
                let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"} = process.env;
                MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/GridvoMqtt`, (err, db) => {
                    if (err) {
                        done(err);
                    }
                    db.collection('mqttpacket').drop((err, response) => {
                        if (err) {
                            done(err);
                        }
                        db.close();
                        done();
                    });
                });
            });
        });
    });
    describe('#getPacketsByTopic(topic, options, callback)', () => {
        context('get mqtt packets from topic and options', () => {
            before(done => {
                let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"} = process.env;
                MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/GridvoMqtt`, (err, db) => {
                    if (err) {
                        done(err);
                    }
                    let insertOperations = {
                        topic: "topic",
                        payload: "payload",
                        messageId: "messageId",
                        qos: 0,
                        retain: false,
                        timestamp: new Date((new Date()).getTime() - 1000 * 60)
                    };
                    db.collection('mqttpacket').insertOne(insertOperations, (err, result) => {
                        if (err) {
                            done(err);
                        }
                        db.close();
                        done();
                    });
                });
            });
            it('packets should be [] if no this topic of options not match', done => {
                let topic = "/no/topic";
                let endTimestamp = (new Date()).getTime();
                let startTimestamp = endTimestamp - 600 * 1000;
                let options = {
                    startTimestamp,
                    endTimestamp,
                    skip: 0,
                    limit: 0
                };
                DAO.getPacketsByTopic(topic, options, (err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    resultJSON.topic.should.be.eql("/no/topic");
                    resultJSON.packets.length.should.be.eql(0);
                    done();
                });
            });
            it('should return packets', done => {
                let topic = "topic";
                let endTimestamp = (new Date()).getTime();
                let startTimestamp = endTimestamp - 600 * 1000;
                let options = {
                    startTimestamp,
                    endTimestamp,
                    skip: 0,
                    limit: 0
                };
                DAO.getPacketsByTopic(topic, options, (err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    resultJSON.topic.should.be.eql("topic");
                    resultJSON.packets.length.should.be.eql(1);
                    done();
                });
            });
            after(done => {
                let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"} = process.env;
                MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/GridvoMqtt`, (err, db) => {
                    if (err) {
                        done(err);
                    }
                    db.collection('mqttpacket').drop((err, response) => {
                        if (err) {
                            done(err);
                        }
                        db.close();
                        done();
                    });
                });
            });
        });
    });
});