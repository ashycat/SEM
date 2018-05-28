/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var should = require('should');

describe('api/brokergroups', function() {
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
  
  // 주선소 그룹 등록
  var broker_group_id = Math.floor((Math.random() * 1000) + 1);
  it('post api/brokergroups', function(done) {
    request(mock)
    .post('/api/brokergroups?apiKey=apiKey&secretKey=secretKey')
    .send({"id": "" + broker_group_id, "name":"123", "creator":"1"})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      done(err);
    });
  });
  
  // 주선소 그룹 수정
  it('put api/brokergroups/:broker_group_id', function(done) {
    request(mock)
    .put('/api/brokergroups/' + broker_group_id + '?apiKey=apiKey&secretKey=secretKey')
    .send({"id": "" + broker_group_id , "name":"changed 123", "modifier":"1"})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1); 
      done(err);
    });
  });
  
  // 주선소 그룹 멤버 추가
  var broker_id = 0;
  it('post api/brokers and post api/brokergroups/:broker_group_id/members', function(done) {
    // step 1 : create broker
    request(mock)
    .post('/api/brokers?apiKey=apiKey&secretKey=secretKey')
    .send({"name": "new broker", "telephone":"123-1234-1234", "handphone":"333-3333-3333", "creator":"1"})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("err : ", err);
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      broker_id = res.body.contents.insertId;
      
      // step 2 : add brokerGroupMember
      request(mock)
      .post('/api/brokergroups/' + broker_group_id + '/members?apiKey=apiKey&secretKey=secretKey')
      .send({"broker_id": ""+broker_id, "role":"SLAVE", "rate":"30", "creator":"1"})
      .expect(200)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        console.log("response : ", res.body);
        should.equal(res.body.code, '0');
        should.equal(res.body.contents.affectedRows, 1);
        done(err);
      });
    });
  });
  
  //주선소 그룹 멤버 조회
  it('get api/brokergroups/:broker_group_id/members', function(done) {
    request(mock)
    .get('/api/brokergroups/' + broker_group_id + '/members?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.info.size, 1);
      done(err);
    });
  });
  
  //주선소 그룹 멤버 수정
  it('put api/brokergroups/:broker_group_id/members/:broker_id', function(done) {
    request(mock)
    .put('/api/brokergroups/' + broker_group_id + '/members/' + broker_id + '?apiKey=apiKey&secretKey=secretKey')
    .send({"role":"SLAVE", "rate":"10"})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body, err);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      done(err);
    });
  });
  
  // 주선소 그룹 멤버 삭제
  it('delete api/brokergroups/:broker_group_id/members/:broker_id', function(done) {
    request(mock)
    .del('/api/brokergroups/' + broker_group_id + '/members/' + broker_id + '?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      done(err);
    });
  });
  
  // 삭제
  it('delete api/brokergroups/:broker_group_id', function(done) {
    request(mock)
    .del('/api/brokergroups/' + broker_group_id + '?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      done(err);
    });
  });
  
});