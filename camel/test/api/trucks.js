/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var should = require('should');

describe('api/trucks', function() {
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
  
  // 차량 등록
  var broker_id = 0;
  var user_id = 0;
  var truck_id = 0;
  var broker_group_id = Math.floor((Math.random() * 1000) + 1);
  it('post api/trucks', function(done) {
    
    // 주선소 등록
    request(mock)
    .post('/api/brokers?apiKey=apiKey&secretKey=secretKey')
    .send(  
        {"name": "주선소", 
         "telephone":"111-222-3333", 
         "handphone":"010-4040-5959", 
         "address_id":"1", 
         "address_detail":"주소상세", 
         "post_code":"222323", 
         "creator":"1"}
    )
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      broker_id = res.body.contents.insertId;
      
      
      // 차주 등록
      request(mock)
      .post('/api/users/truck?apiKey=apiKey&secretKey=secretKey')
      .send(
        {"user_name":"userName",
        "phone":"111-222-3333",
        "email":"gyro74@gmail.com",
        "role":"operator",
        "action_key":"actionKey",
        "broker_id":"" + broker_id}
      )
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        console.log("response : ", res.body);
        should.equal(res.body.code, '0');
        user_id = res.body.contents.id;
       
        
        // 차주 수정
        request(mock)
        .put('/api/users/'+ user_id +'?apiKey=apikey&secretKey=secretKey')
        .send( {"phone": "222-2222-2222", 
          "user_name":"update name",
          "email":"update" + user_id + "@keke.dom"}
        )
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          console.log("response : ", res.body);
          should.equal(res.body.code, '0');
          should.equal(res.body.contents.affectedRows, 1);
          
          
          // 차량 등록
          request(mock)
          .post('/api/trucks?apiKey=apikey&secretKey=secretKey')
          .send(
              {"type": "1", 
                "weight":"1.5", 
                "model":"carModel1231", 
                "carNumber":"경기12어1233", 
                "registeredNumber":"11232123", 
                "ownerId":"" + user_id, 
                "brokerId" : "" + broker_id,
                "creator":"1"}
          )
          .expect(200)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            console.log("response : ", res.body);
            should.equal(res.body.code, '0');
            should.equal(res.body.contents.affectedRows, 1);
            truck_id = res.body.contents.insertId;
            
            // 차량 수정
            request(mock)
            .put('/api/trucks/' + truck_id + '?apiKey=apiKey&secretKey=secretKey')
            .send(  
                  {"id":"" + truck_id,
                   "type": "1", 
                   "weight":"1.5", 
                   "model":"update_123", 
                   "carNumber":"경기12어1233", 
                   "registeredNumber":"11232123", 
                   "ownerId":"1", 
                   "brokerId" : "" + broker_id,
                   "status":"STOP",
                   "modifier":"1"})
            .expect(200)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              console.log("response : ", res.body);
              should.equal(res.body.code, '0');
              should.equal(res.body.contents.affectedRows, 1); 
              
              // 차량 삭제
              request(mock)
              .del('/api/trucks/' + truck_id + '?apiKey=apiKey&secretKey=secretKey')
              .expect(200)
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .end(function (err, res) {
                console.log("response : ", res.body);
                should.equal(res.body.code, '0');
                should.equal(res.body.contents.affectedRows, 1);
                
                
                // 차주 삭제
                request(mock)
                .del('/api/users/' + user_id + '?apiKey=apiKey&secretKey=secretKey')
                .expect(200)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                  console.log("response : ", res.body);
                  should.equal(res.body.code, '0');
                  should.equal(res.body.contents.affectedRows, 1);
                  
                  
                  // 주선소 삭제
                  request(mock)
                  .del('/api/brokers/' + broker_id + '?apiKey=apiKey&secretKey=secretKey')
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
        });
      });
    });
  });
});