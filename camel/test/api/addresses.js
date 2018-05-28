/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var should = require('should');

describe('api/addresses', function() {
  var app, mock;
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
  
  // 지번 우편번호 조회(검색) 
  var broker_group_id = Math.floor((Math.random() * 1000) + 1);
  it('get api/addresses/numbers', function(done) {
    request(mock)
    .get('/api/addresses/numbers?location_name=11&apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      done(err);
    });
  });
  
  
  // 도로명 우편번호 조회(검색)
  var location_address_id = 0;
  var broker_group_id = Math.floor((Math.random() * 1000) + 1);
  it('get api/addresses/streets', function(done) {
    request(mock)
    .get('/api/addresses/streets?road_name=개포로&apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      location_address_id = res.body.contents[0].id;
      
      // 주소 조회 
      request(mock)
      .get('/api/addresses/' + location_address_id + '?apiKey=apiKey&secretKey=secretKey')
      .expect(200)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        console.log("response : ", res.body);
        should.equal(res.body.code, '0');
        done(err);
      });
    });
  });
});
