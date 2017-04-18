const _ = require('underscore');
const should = require('should');
const request = require('supertest');
const express = require('express');
const mqttRouter = require('../../../lib/express/routes/mqtt');

describe('mqttRouter use case test', () => {
    let app;
    let server;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.use('/mqtt', mqttRouter);
                let mockMqttTopicService = {};
                mockMqttTopicService.getTopicTree = (callback) => {
                    callback(null, {});
                }
                mockMqttTopicService.getMqttPacketsByTopic = (topic, options, callback) => {
                    callback(null, {topic: "rt/GF", packets: []});
                }
                app.set('mqttTopicService', mockMqttTopicService);
                server = app.listen(3001, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        async function setup() {
            await setupExpress();
        };
        setup().then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('#get:/mqtt/packets?topic=&startTimestamp=&endTimestamp=&skip=&limit=', () => {
        context('get mqtt packets', () => {
            it('should response fail if no topic', done => {
                request(server)
                    .get(`/mqtt/packets`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(400);
                        res.body.errmsg.should.be.eql("fail");
                        done();
                    });
            });
            it('should response success', done => {
                request(server)
                    .get(`/mqtt/packets?topic=rt/GF`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(0);
                        res.body.errmsg.should.be.eql("ok");
                        res.body.result.topic.should.be.eql("rt/GF");
                        res.body.result.packets.length.should.be.eql(0);
                        done();
                    });
            });
        });
    });
    describe('#get:/mqtt/topic-tree', () => {
        context('get mqtt topic tree', () => {
            it('should return mqtt topic tree', done => {
                request(server)
                    .get(`/mqtt/topic-tree`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(0);
                        res.body.errmsg.should.be.eql("ok");
                        should.exist(res.body.result);
                        done();
                    });
            });
        });
    });
    after(done => {
        function teardownExpress() {
            return new Promise((resolve, reject) => {
                server.close(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        async function teardown() {
            await teardownExpress();
        };
        teardown().then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
});