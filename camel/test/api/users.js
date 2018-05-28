/**
 * Message api test 
 * New node file
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var should = require('should');
//var timeout = require('connect-timeout'); //express v4

describe('api/users', function() {
  this.timeout(3000);
  
  var app, mock;
  beforeEach(function(done) {
    app = express();
    app.on('start', done);
    app.use(kraken({
      basedir : process.cwd(),
      onconfig : config(app).onconfig
    }));
    //app.use(timeout('50s'));
    mock = app.listen(1337);
  });
  
  afterEach(function (done) {
    mock.close(done);
  });
  
//it('checkActionKey api/users/:id/checkActionKey/:key', function(done) {
//request(mock)
//.get('/api/users/1/checkActionKey/''')
//.send(params)
//.expect(200)
//.set('Accept', 'application/json')
//.expect('Content-Type', /json/)
//.end(function (err, res) {
//  done(err);
//});
//});
  
  // 사용자 생성 -> 주선소 등록 가능 유저 조회 -> 사용자(차주) 사업자 정보 등록
  var user_id = 0;
  it('post api/users', function(done) {
    // 사용자 생성
    var randomId = Math.floor((Math.random() * 1000) + 1);
    request(mock)
    .post('/api/users?apiKey=apiKey&secretKey=secretKey')
    .send({
        "user_id": "userId" + randomId, 
        "password":"password", 
        "user_name":"userName",
        "phone":"111-222-3333",
        "email":"gyro74@gmail.com",
        "role":"operator",
        "action_key":"actionKey"
      })
    .expect(200)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      console.log("response : ", res.body);
      should.equal(res.body.code, '0');
      should.equal(res.body.contents.affectedRows, 1);
      user_id = res.body.contents.id;
      
      
      // 사용자 수정
      request(mock)
      .put('/api/users/' + user_id +'?apiKey=apiKey&secretKey=secretKey')
      .send({
        "user_name": "userNm" + randomId, 
        "phone":"111-222-3333",
        "email":"gyro74@gmail.com",
        "status":"INACTIVE",
        "action_key":"actionKey" })
      .expect(200)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        console.log("response : ", res.body);
        should.equal(res.body.code, '0');
        should.equal(res.body.contents.affectedRows, 1);
        
        // 주선소 등록 가능한 유저 등록
        // 검증방법 : 등록된 유저가 검색되어야 한다.
        request(mock)
        .get('/api/users/broker/unassign?limit=1000&apiKey=apiKey&secretKey=secretKey')
        .expect(200)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          console.log("response : ", res.body);
          should.equal(res.body.code, '0');
          var search_user_id = 0;
          for( i = 0 ; i < res.body.contents.length; i++ ) {
            if( res.body.contents[i].id == user_id ) {
              search_user_id = res.body.contents[i].id;
            }
          }
          should.equal(search_user_id, user_id);
          
          
          // 사용자(차주) 사업자 정보 등록
          request(mock)
          .post('/api/users/' + user_id+ '/business?apiKey=apiKey&secretKey=secretKey')
          .send( {"user_id": "" + user_id, 
            "business_number" : "businessnumber",
            "business_name":"businessName",
            "owner_name":"ownerName",
            "business_condition":"01",
            "business_type":"01110",
            "address_id":"11",
            "address_detail" : "addressDetail",
            "creator":"" + user_id })
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
