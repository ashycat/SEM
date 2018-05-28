/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var should = require('should');

describe('api/brokers', function() {
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
  
  // common var
  var broker_id = 1;
  var consigner_id = 0;
  
  
  // TODO : 첫번째 스텝으로 주선소 등록도 추가해야 한다.
  
  // 등록
  it('post api/brokers/:broker_id/consigners', function(done) {
    request(mock)
    .post('/api/brokers/' + broker_id + '/consigners?apiKey=apiKey&secretKey=secretKey')
    .send({"name":"123",
      "phone":"123",
      "fax":"123",
      "broker_id":"1",
      "creator":"1",
      "business_taxtype":"1",
      "business_ceo_name":"123",
      "business_name":"123",
      "business_license":"123",
      "business_condition":"03",
      "business_type":"03111",
      "business_address_id":"11",
      "business_address_detail":"123",
      "member_name":"123",
      "member_telephone":"123",
      "member_handphone":"123",
      "member_email":"123",
      "member_description":"123"})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      consigner_id = res.body.contents.consigner_id;
       done(err);
    });
  });
  
  // 수정
  it('put api/brokers/:broker_id/consigners:/consigner_id', function(done) {
    request(mock)
    .put('/api/brokers/' + broker_id + '/consigners/' + consigner_id + '?apiKey=apiKey&secretKey=secretKey')
    .send({name:'우노아이티', phone:'111-1111-1111', fax:'123-1234-1234', user_id:'1'})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.contents.affectedRows, 1); 
      done(err);
    });
  });
  
  // 조회
  it('get api/brokers/:broker_id/consigners', function(done) {
    request(mock)
    .get('/api/brokers/' + broker_id + '/consigners?apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      done(err);
    });
  });
  
  // 조건 조회
  it('find api/brokers/:broker_id/consigners', function(done) {
    request(mock)
    .get('/api/brokers/' + broker_id + '/consigners?type=find&name=우노아이티&apiKey=apiKey&secretKey=secretKey')
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      done(err);
    });
  });
  
  
  // 삭제
  it('delete api/brokers/:broker_id/consigners/:consigner_id', function(done) {
    request(mock)
    .del('/api/brokers/1/consigners/' + consigner_id + '?apiKey=apiKey&secretKey=secretKey')
    .send({})
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.contents.affectedRows, 1); // code=40000 이면 정상 
      done(err);
    });
  });
  
});