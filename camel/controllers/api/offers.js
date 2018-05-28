'use strict';

var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var offerDao = require('../../dao/offer');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');

module.exports = function(router) {

  /**
   * @api {get} /offers Offer 리스트
   * @apiName listOffer
   * @apiGroup offer
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {Number} id Offer 아이디   
   * @apiSuccess {Number} truck_id 트럭 아이디 
   * @apiSuccess {String} type 일반/공차 구분
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성 시간
   * @apiSuccess {Number} modifier 수정자 아이디  
   * @apiSuccess {Date} modified 수정 시간 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"truck_id":1,"type":"일반","status":"INACTIVE","creator":1,"created":"2015-06-14T08:17:11.000Z","modifier":1,"modifier":"2015-06-14T08:17:11.000Z"},
   *   {"id":2,"truck_id":2,"type":"공차","status":"INACTIVE","creator":1,"created":"2015-06-14T08:17:11.000Z","modifier":1,"modifier":"2015-06-14T08:17:11.000Z"}
   * ]}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.get('/', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1
    }
    offerDao.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /offers/find Offer 검색  
   * @apiName listOfferByType
   * @apiGroup offer
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} type 일반/공차 구분
   * 
   * @apiSuccess {Number} id Offer 아이디   
   * @apiSuccess {Number} truck_id 트럭 아이디 
   * @apiSuccess {String} type 일반/공차 구분
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성 시간
   * @apiSuccess {Number} modifier 수정자 아이디  
   * @apiSuccess {Date} modified 수정 시간 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"truck_id":1,"type":"공차","status":"INACTIVE","creator":1,"created":"2015-06-14T08:17:11.000Z","modifier":1,"modifier":"2015-06-14T08:17:11.000Z"},
   *   {"id":2,"truck_id":2,"type":"공차","status":"INACTIVE","creator":1,"created":"2015-06-14T08:17:11.000Z","modifier":1,"modifier":"2015-06-14T08:17:11.000Z"}
   * ]}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.get('/find', function(req, res) {
    var param = {
        type : req.query.type,
        truckId : req.query.truckId,
        status : req.query.status
    }
    offerDao.find(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /offers/:id 개별 Offer 조회 
   * @apiName listOfferById
   * @apiGroup offer
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {Number} id Offer 아이디
   * 
   * @apiSuccess {Number} id Offer 아이디   
   * @apiSuccess {Number} truck_id 트럭 아이디 
   * @apiSuccess {String} type 일반/공차 구분
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성 시간
   * @apiSuccess {Number} modifier 수정자 아이디  
   * @apiSuccess {Date} modified 수정 시간 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"truck_id":1,"type":"공차","status":"INACTIVE","creator":1,"created":"2015-06-14T08:17:11.000Z","modifier":1,"modifier":"2015-06-14T08:17:11.000Z"},
   *   {"id":2,"truck_id":2,"type":"공차","status":"INACTIVE","creator":1,"created":"2015-06-14T08:17:11.000Z","modifier":1,"modifier":"2015-06-14T08:17:11.000Z"}
   * ]}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~"
   *  ]}
   * 
   */
  router.get('/:id', function(req, res) {
    var param = {
        id : req.params.id
    }
    offerDao.one(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /offers Offer 등록
   * @apiName CreateOffer
   * @apiGroup offer
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, broker, operator
   * 
   * @apiParam {Number} truck_id 트럭 아이디 
   * @apiParam {String} type 일반/공차 구분
   * @apiParam {Number} creator 생성자 아이디 
   * @apiParam {Number} modifier 수정자 아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,",
   *  "contents":"ok"
   * }
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~"
   *  ]}
   * 
   */
  router.post('/', function(req, res) {
    if (check.undefined(req.body.truckId) || 
        check.undefined(req.body.type)) {
      RestResponse.failure(res, req.query.uuid, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        truckId : req.body.truckId*1,
        type : req.body.type.trim(),
        userId : req.cookies.id*1
    }
    var permission = {
        allow : ['operator', 'admin', 'truck_user'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }

    userAuth.isAuthenticate(permission, function() {
      offerDao.create(param, function(){
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * Offer에서 배차 등록  
   */
  router.post('/:id/allocation', function(req, res) {
    // TODO : 향후 구현한다. 
  });
  
  
  /**
   * @api {put} /offers/:id Offer 수정 
   * @apiName updateOffer
   * @apiGroup offer
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, operator, admin
   * 
   * @apiParam {Number} truck_id 트럭 아이디 
   * @apiParam {String} type 일반/공차 구분
   * @apiParam {Number} modifier 수정자 아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,
   *  "contents":"ok"
   * }
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000, message: ["Query Error : ~~~~~~"]}
   * 
   */
  router.put('/:id', function(req, res) {
    if (check.undefined(req.body.truck_id) || 
        check.undefined(req.body.type) ||
        check.undefined(req.body.status)) {
      RestResponse.failure(res, req.query.uuid, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        truck_id : req.body.truck_id*1,
        type : req.body.type.trim(),
        status : req.body.status.trim(),
        userId : req.cookies.id*1,
        id : req.params.id
    }
    var permission = {
        allow : ['user', 'operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    userAuth.isAuthenticate(permission, function() {
      offerDao.update(param, function(){
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /offers/:id Offer 삭제
   * @apiName deleteOffer
   * @apiGroup offer
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,
   *  "contents":"ok"
   * }
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000, message: ["Query Error : ~~~~~~"]}
   * 
   */
  router.delete('/:id', function(req, res) {
    var param = {
        id : req.params.id
    }
    offerDao.delete(param, function() {
      RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
}