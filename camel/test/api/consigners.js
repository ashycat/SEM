/**
 * Message api test 
 */
var expect = require('chai').expect;
var kraken = require('kraken-js');
var express = require('express');
var request = require('supertest');
var config = require('../lib/testconfig');
var should = require('should');

describe('api/consigners', function() {
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

  // 변수
  var broker_id = 0;
  var consigner_id = 0;
  var member_id = 0;
  var business_id= 0;
 
  // 주선소 생성
  it('create api/brokers', function(done) {
	request(mock)
	.post('/api/brokers?apiKey=apiKey&secretKey=secretKey')
	.send({ name:'담당자', 
	        telephone:'111-1111-1111', 
	        handphone:'222-2222-2222', 
	        creator:'1' })
	.expect(200)
	.set('Accept', 'application/json')
	.expect('Content-Type', /json/)
	.end(function (err, res) {
	  console.log("response : ", res.body);
	  should.equal(res.body.code, '0');
	  should.equal(res.body.contents.affectedRows, 1);
	  broker_id = res.body.contents.insertId;
	      
	  // 화주 생성
	  request(mock)
	  .post('/api/consigners?apiKey=apiKey&secretKey=secretKey')
	  .send({name:'우노아이티', 
		  phone:'111-1111-1111', 
		  fax:'123-1234-1234',
		  creator : '1',
		  broker_id:''+broker_id,
		  member_name:'담당자1',
		  member_telephone:'12-123-123',
		  member_handphone:'010-111-1111',
		  member_email:'damdang@gmail.com',
		  member_description:'담당자 비고',
		  business_taxtype:'1',
		  business_ceo_name:'지저스',
		  business_name:'전팔봉',
		  business_condition:'11',
		  business_type:'33110',
		  business_address_id:'1',
		  business_address_detail:'address detail'})
	  .expect(200)
	  .set('Accept', 'application/json')
	  .expect('Content-Type', /json/)
	  .end(function (err, res) {
	    console.log("create response : ", res.body);
	    should.equal(res.body.code, '0');
	    should.equal(res.body.contents.affectedRows, 1);
	    consigner_id = res.body.contents.insertId;
	    
	    // 담당자 등록
	    request(mock)
	    .post('/api/consigners/' + consigner_id + '/members?apiKey=apiKey&secretKey=secretKey')
	    .send({
	        member_name:'담당자', 
	        member_telephone:'111-1111-1111', 
	        member_handphone:'222-2222-2222', 
	        member_email:'test@gmail.com', 
	        member_description:'desc', 
	        creator:'1'
	     })
	    .expect(200)
	    .set('Accept', 'application/json')
	    .expect('Content-Type', /json/)
	    .end(function (err, res) {
	      console.log("response : ", res.body);
	      should.equal(res.body.code, '0');
	      should.equal(res.body.contents.affectedRows, 1);
	      member_id = res.body.contents.member_id;
	      
	      
	      // 담당자 수정
	      request(mock)
	      .put('/api/consigners/' + consigner_id + '/members/' + member_id + '?apiKey=apiKey&secretKey=secretKey')
	      .send({
	        member_name:'changed 담당자', 
	        member_telephone:'111-1111-1111', 
	        member_handphone:'222-2222-2222', 
	        member_email:'test@gmail.com', 
	        member_description:'desc', 
	        modifier:'1'
	       })
	      .expect(200)
	      .set('Accept', 'application/json')
	      .expect('Content-Type', /json/)
	      .end(function (err, res) {
	        console.log("response : ", res.body);
	        should.equal(res.body.code, '0');
	        should.equal(res.body.contents.affectedRows, 1);
	        
	        
	        // 담당자 삭제
	        request(mock)
	        .del('/api/consigners/' + consigner_id + '/members/' + member_id + '?apiKey=apiKey&secretKey=secretKey')
	        .expect(200)
	        .set('Accept', 'application/json')
	        .expect('Content-Type', /json/)
	        .end(function (err, res) {
	          console.log("response : ", res.body);
		      should.equal(res.body.code, '0');
		      should.equal(res.body.contents.affectedRows, 1);
		        
		      
	          // 사업자 정보 등록
		      request(mock)
		      .post('/api/consigners/' + consigner_id + '/business?apiKey=apiKey&secretKey=secretKey')
		      .send({
		        business_taxtype:'1',
		        business_ceo_name:'대표1',
		        business_name:'상호1',
		        business_condition:'03',
		        business_type:'03111',
		        business_address_id:'11',
		        business_address_detail:'주소 상세',
		        creator:'1'})
		      .expect(200)
		      .set('Accept', 'application/json')
		      .expect('Content-Type', /json/)
		      .end(function (err, res) {
		        console.log("response : ", res.body);
		        should.equal(res.body.code, '0');
		        should.equal(res.body.contents.affectedRows, 1);
		        business_id = res.body.contents.business_id;
		      
		        
		        // 사업자 정보 수정
		        request(mock)
		        .put('/api/consigners/' + consigner_id + '/business/' + business_id + '?apiKey=apiKey&secretKey=secretKey')
		        .send({
		          business_taxtype:'1',
		          business_license:'1029384756',
		          business_ceo_name:'changed 대표1',
		          business_name:'상호1',
		          business_condition:'03',
		          business_type:'03111',
		          business_address_id:'11',
		          business_address_detail:'주소 상세',
		          modifier:'1'
		        })
		        .expect(200)
		        .set('Accept', 'application/json')
		        .expect('Content-Type', /json/)
		        .end(function (err, res) {
		          console.log("response : ", res.body);
		          should.equal(res.body.code, '0');
		          should.equal(res.body.contents.affectedRows, 1);
		          
		          
		          // 사업자 정보 삭제
		          request(mock)
			      .del('/api/consigners/' + consigner_id + '/business/' + business_id + '?apiKey=apiKey&secretKey=secretKey')
			      .expect(200)
			      .set('Accept', 'application/json')
			      .expect('Content-Type', /json/)
			      .end(function (err, res) {
			        console.log("response : ", res.body);
				    should.equal(res.body.code, '0');
				    should.equal(res.body.contents.affectedRows, 1);
				    
				    // 화주 삭제
				    request(mock)
				    .del('/api/consigners/' + consigner_id + '?apiKey=apiKey&secretKey=secretKey')
				    .expect(200)
				    .set('Accept', 'application/json')
				    .expect('Content-Type', /json/)
				    .end(function (err, res) {
				      console.log("response : ", res.body);
					  should.equal(res.body.code, '0');

					  
					  // 주선소 삭제
					  request(mock)
					  .del('/api/brokers/' + broker_id + '?apiKey=apiKey&secretKey=secretKey')
					  .send({})
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
  });
});