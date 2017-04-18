'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const MqttTopicService = require('../../../lib/application/service/mqttTopicService');

describe('MqttTopicService use case test', () => {
    let service;
    before(() => {
        service = new MqttTopicService();
    });
    describe('#getTopicTree(callback)', () => {
        context('get topic tree', () => {
            it('return topicTree', done => {
                let mockMqttPacketDAO = {};
                mockMqttPacketDAO.getAllTopic = (callback) => {
                    callback(null, ["$SYS/broken/new/clients",
                        "rt/GF/FZMHQJT/ANGLE/publish",
                        "rt/GF/FZMHQJT/FSFXY/publish",
                        "/rt/GF/FZMHQJT/ANGLE/config"]);
                };
                muk(service, "_mqttPacketDAO", mockMqttPacketDAO);
                service.getTopicTree((err, topicTree) => {
                    if (err) {
                        done(err);
                    }
                    topicTree.text.should.eql("root");
                    topicTree.leaf.should.eql(false);
                    topicTree.children.length.should.eql(2);
                    done();
                });
            });
        });
    });
    describe('#getMqttPacketsByTopic(topic, options, callback)', () => {
        context('get mqtt packet by topic', () => {
            it('is err if no topic', done => {
                let mockMqttPacketDAO = {};
                mockMqttPacketDAO.getPacketsByTopic = (topic, options, callback) => {
                    callback(null, []);
                };
                muk(service, "_mqttPacketDAO", mockMqttPacketDAO);
                let topic = null;
                let options = {};
                service.getMqttPacketsByTopic(topic, options, (err, mqttPackets) => {
                    should.exist(err);
                    should.not.exist(mqttPackets)
                    done();
                });
            });
            it('return mqtt packets by topic', done => {
                let mockMqttPacketDAO = {};
                mockMqttPacketDAO.getPacketsByTopic = (topic, options, callback) => {
                    callback(null, {
                        topic: "rt/GF",
                        packets: []
                    });
                };
                muk(service, "_mqttPacketDAO", mockMqttPacketDAO);
                let topic = "rt/GF";
                let options = {};
                service.getMqttPacketsByTopic(topic, options, (err, mqttPackets) => {
                    should.not.exist(err);
                    mqttPackets.topic.should.eql("rt/GF");
                    mqttPackets.packets.length.should.eql(0);
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});