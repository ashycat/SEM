
/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var should = require('should');

describe('api/orders', function() {
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


  //
  var consigner_id = 3;
  var goods_category_id = 1;
  var broker_id = 1;
  var goods_id = 0;
  
  var broker_group_id = Math.floor((Math.random() * 1000) + 1);
  it('post api/orders', function(done) {
    
    // 오더 등록
    request(mock)
    .post('/api/orders?apiKey=apiKey&secretKey=secretKey')
    .send({
	  "type": "type",
	  "consigner_id":"" + consigner_id, 
	  "broker_id":"" + broker_id, 
	  "goods_category_id":"" + goods_category_id, 
	  "goods_weight":"12", 
	  "length":"12", 
	  "sender_name":"sender_name", 
	  "sender_handphone":"123", 
	  "sender_telephone":"123", 
	  "sendee_name":"sendee_name", 
	  "sendee_handphone":"123", 
	  "sendee_telephone":"123", 
	  "description":"123", 
	  "source_id":"123", 
	  "destination_id":"123", 
	  "load_datetime":"2015-09-10 12:12:12", "unload_datetime":"2015-09-11 12:12:12", 
	  "load_method":"123", 
	  "unload_method":"123", 
	  "order_weight":"123", 
	  "truckCount":"1",  // 동일한 주문을 왜 복수개 생성하는가 ?
	  "payment_type":"123", 
	  "freight":"123", 
	  "fee":"123"}
     )
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      order_id = res.body.contents.insertId;
      
      
      // 오더 조회(단건)
      request(mock)
      .get('/api/orders/' + order_id + '?apiKey=apiKey&secretKey=secretKey')
      .expect(200)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        console.log("response : ", res.body);
        should.equal(res.body.code, '0');
        goods_id = res.body.contents.goods_id;

        // 오더 수정
        request(mock)
        .put('/api/orders/' + order_id + '?apiKey=apiKey&secretKey=secretKey')
        .send({
          "type": "type",
          "order_id":"" + order_id,
          "goods_id":"" + goods_id,
          "consigner_id":"" + consigner_id, 
          "broker_id":"" + broker_id, 
          "goods_category_id":"" + goods_category_id, 
          "goods_weight":"12", 
          "length":"12", 
          "is_shuttle":"0", 
          "is_quick":"0", 
          "sender_name":"update_name", 
          "sender_handphone":"123", 
          "sender_telephone":"123", 
          "sendee_name":"update_name", 
          "sendee_handphone":"123", 
          "sendee_telephone":"123", 
          "description":"123", 
          "source_id":"123", 
          "destination_id":"123", 
          "load_datetime":"2015-09-10 12:12:12", 
          "unload_datetime":"2015-09-11 12:12:12", 
          "load_method":"123", 
          "unload_method":"123", 
          "order_weight":"123", 
          "truckCount":"1",  // 동일한 주문을 왜 복수개 생성하는가 ?
          "payment_type":"123", 
          "freight":"123", 
          "fee":"123"}
        )
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
  });
});
