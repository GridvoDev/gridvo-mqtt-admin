'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const sessionService = require('../../../lib/application/service/sessionService');

describe('sessionService use case test', () => {
    let service;
    before(() => {
        service = new sessionService();
    });
    describe('#getSessions(options, callback)', () => {
        context('get sessions', () => {
            it('return sessions', done => {
                let mockSessionDAO = {};
                mockSessionDAO.getSessions = (options, callback) => {
                    callback(null, [
                        {
                            serverID: "server-id-1",
                            clientID: "client-id-1",
                            loginTime: new Date()
                        },
                        {
                            serverID: "server-id-2",
                            clientID: "client-id-2",
                            loginTime: new Date()
                        },
                        {
                            serverID: "server-id-3",
                            clientID: "client-id-3",
                            loginTime: new Date()
                        }
                    ]);
                };
                muk(service, "_sessionDAO", mockSessionDAO);
                let options = {};
                service.getSessions(options, (err, sessions) => {
                    should.not.exist(err);
                    sessions.length.should.eql(3);
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});