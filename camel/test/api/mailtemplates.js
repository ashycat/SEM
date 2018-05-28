/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var proxyquire = require('proxyquire');

describe('api/mailtemplates', function() {
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

  it('create api/mailtemplates', function(done){
    request(mock)
    .post('/api/mailtemplates?apiKey=apiKey&secretKey=secretKey')
    .send({subject:'test template subject', content:'test template content', id:1})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      insertId = res.body.contents;
      done(err);
    });
  });

  it('list api/mailtemplates', function(done){
    request(mock)
    .get('/api/mailtemplates?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });
  
  it('one api/mailtemplates', function(done){
    request(mock)
    .get('/api/mailtemplates/'+ insertId +'?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });
  

  it('update api/mailtemplates/:id', function(done){
    request(mock)
    .put('/api/mailtemplates/'+ insertId +'?apiKey=apiKey&secretKey=secretKey')
    .send({subject:'update subject', content:'update content', userId:1})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });

  it('create ReceiverGroup api/mailtemplates/:template_id/rolegroups', function(done){
    request(mock)
    .post('/api/mailtemplates/'+ insertId +'/rolegroups?apiKey=apiKey&secretKey=secretKey')
    .send({template_id:insertId, receiverGroup: 2})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });
  
  it('delete ReceiverGroup api/mailtemplates/:template_id/rolegroups', function(done){
    request(mock)
    .post('/api/mailtemplates/'+ insertId +'/rolegroups?apiKey=apiKey&secretKey=secretKey')
    .send({template_id:insertId})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log(res.body);
      done(err);
    });
  });
});