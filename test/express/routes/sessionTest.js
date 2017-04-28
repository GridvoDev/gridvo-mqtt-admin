const _ = require('underscore');
const should = require('should');
const request = require('supertest');
const express = require('express');
const sessionRouter = require('../../../lib/express/routes/session');

describe('sessionRouter use case test', () => {
    let app;
    let server;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.use('/sessions', sessionRouter);
                let mockSessionService = {};
                mockSessionService.getSessions = (options, callback) => {
                    callback(null, []);
                }
                app.set('sessionService', mockSessionService);
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
    describe('#get:/sessions?skip=&limit=', () => {
        context('get sessions', () => {
            it('should response success', done => {
                request(server)
                    .get(`/sessions`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(0);
                        res.body.errmsg.should.be.eql("ok");
                        res.body.result.length.should.be.eql(0);
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