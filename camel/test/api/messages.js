/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var proxyquire = require('proxyquire');

describe('api/messages', function() {
  var app, mock;
  var insertId = 0;
  beforeEach(function(done) {
    app = express();
    app.on('start', done);
    app.use(kraken({
      basedir : process.cwd(),
      onconfig : config(app).onconfig
    }));
    mock = app.listen(1337);
  });
  
  afterEach(function (done) {
    mock.close(done);
  });

  it('create api/messages', function(done) {
    request(mock)
    .post('/api/messages?apiKey=apiKey&secretKey=secretKey')
    .send({subject:'message test', content:'message content'})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      insertId = res.body.contents;
      done(err);
    });
  });
  
  it('list api/messages', function(done){
    request(mock)
    .get('/api/messages?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });

  it('one api/messages/:id', function(done){
    request(mock)
    .get('/api/messages/' + insertId + '?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });

  it('wrong one api/messages/:id', function(done){
    request(mock)
    .get('/api/messages/0')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });

  it('update api/messages', function(done) {
    request(mock)
    .put('/api/messages/' + insertId + '?apiKey=apiKey&secretKey=secretKey')
    .send({subject:'message updated test', content:'message updated content'})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });

  it('delete api/messages/:id', function(done){
    request(mock)
    .del('/api/messages/' + insertId + '?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });

  
});