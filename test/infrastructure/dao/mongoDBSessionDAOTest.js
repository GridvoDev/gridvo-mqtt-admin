'use strict';
const MongoClient = require('mongodb').MongoClient;
const _ = require('underscore');
const should = require('should');
const mongoDBSessionDAO = require('../../../lib/infrastructure/dao/mongoDBSessionDAO');

describe('mongoDBSessionDAO use case test', () => {
    let DAO;
    before(() => {
        DAO = new mongoDBSessionDAO();
    });
    describe('#getSessions(options, callback)', () => {
        context('get sessions', () => {
            before(done => {
                let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"} = process.env;
                MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/GridvoMqtt`, (err, db) => {
                    if (err) {
                        done(err);
                    }
                    let insertOperations = {
                        serverID: "server-id",
                        clientID: "client-id",
                        loginTime: new Date()
                    };
                    db.collection('session').insertOne(insertOperations, (err, result) => {
                        if (err) {
                            done(err);
                        }
                        db.close();
                        done();
                    });
                });
            });
            it('should return sessions', done => {
                let options = {};
                DAO.getSessions(options, (err, sessions) => {
                    if (err) {
                        done(err);
                    }
                    sessions.length.should.be.eql(1);
                    done();
                });
            });
            after(done => {
                let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"} = process.env;
                MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/GridvoMqtt`, (err, db) => {
                    if (err) {
                        done(err);
                    }
                    db.collection('session').drop((err, response) => {
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