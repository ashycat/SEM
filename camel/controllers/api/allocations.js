'use strict';

var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var allocationService = require('../../services/allocationService');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var checkPermission = require('../../lib/checkPermission');

module.exports = function(router) {

  /**
   * @api {get} /allocations 배차된 정보 조회 
   * @apiName list
   * @apiGroup allocations
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {Number} limit 한페이지에 목록 갯수 
   * @apiParam {Number} page 페이지 수
   * 
   * @apiSuccess {Number} id 배차 아이디 
   * @apiSuccess {Number} order_id 오더 아이디 
   * @apiSuccess {Number} offer_id 오퍼 아이디 
   * @apiSuccess {Number} allocator 배차사용자 아이디 
   * @apiSuccess {DATE} allocated 배차시간 
   * @apiSuccess {String} type 공유(주선소/화주), 일반(주선소/화주)
   * @apiSuccess {DATE} load_datetime 화물 적재 시간
   * @apiSuccess {String} load_method 상차방법 지게차/수작업/호이스트/크레인/컨베이어
   * @apiSuccess {Number} is_shuttle 왕복여부
   * @apiSuccess {Date} unload_datetime 화물 하차 시간 
   * @apiSuccess {String} unload_method 하차방법 지게차/수작업/호이스트/크레인/컨베이어  
   * @apiSuccess {String} source 상차지
   * @apiSuccess {String} destination 하차지
   * @apiSuccess {Number} goods_id 화물아이디
   * @apiSuccess {Number} weight 무게
   * @apiSuccess {DATE} freight 지불방식
   * @apiSuccess {Number} fee 운송료(운임)
   * @apiSuccess {Number} broker_id 주선소 아이디
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} orderer 등록자 아이디
   * @apiSuccess {Date} order_day 등록 일시
   * @apiSuccess {String} type 일반/공차
   * @apiSuccess {Number} truck_id 트럭 아이디
   * @apiSuccess {Number} offerrer 차주아이디
   * @apiSuccess {Date} offer_day 오퍼 일시
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": [{
   *  
   * }],
   * "info": {
   *    "size": 2
   * }
   *}
   * 
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ER_SP_UNDECLARED_VAR: Undeclared variable: NaN"
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
    allocationService.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /allocations/find 배차 정보 검색 
   * @apiName find
   * @apiGroup allocations
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {Number} allocator 배차 등록 아이디 
   * @apiParam {Date} loadStart 상차 시작 시간 
   * @apiParam {Date} loadEnd 상차 종료 시간 
   * @apiParam {Number} limit 한페이지에 목록 갯수 
   * @apiParam {Number} page 페이지 수
   * 
   * @apiSuccess {Number} id 배차 아이디 
   * @apiSuccess {Number} order_id 오더 아이디 
   * @apiSuccess {Number} offer_id 오퍼 아이디 
   * @apiSuccess {Number} allocator 배차사용자 아이디 
   * @apiSuccess {DATE} allocated 배차시간 
   * @apiSuccess {String} type 공유(주선소/화주), 일반(주선소/화주)
   * @apiSuccess {DATE} load_datetime 화물 적재 시간
   * @apiSuccess {String} load_method 상차방법 지게차/수작업/호이스트/크레인/컨베이어
   * @apiSuccess {Number} is_shuttle 왕복여부
   * @apiSuccess {Date} unload_datetime 화물 하차 시간 
   * @apiSuccess {String} unload_method 하차방법 지게차/수작업/호이스트/크레인/컨베이어  
   * @apiSuccess {String} source 상차지
   * @apiSuccess {String} destination 하차지
   * @apiSuccess {Number} goods_id 화물아이디
   * @apiSuccess {Number} weight 무게
   * @apiSuccess {DATE} freight 지불방식
   * @apiSuccess {Number} fee 운송료(운임)
   * @apiSuccess {Number} broker_id 주선소 아이디
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} orderer 등록자 아이디
   * @apiSuccess {Date} order_day 등록 일시
   * @apiSuccess {String} type 일반/공차
   * @apiSuccess {Number} truck_id 트럭 아이디
   * @apiSuccess {Number} offerrer 차주아이디
   * @apiSuccess {Date} offer_day 오퍼 일시
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": [{
   *  
   * }],
   * "info": {
   *    "size": 2
   * }
   *}
   * 
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ER_SP_UNDECLARED_VAR: Undeclared variable: NaN"
   *  ]}
   * 
   */
  router.get('/find', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        allocator : req.query.allocator,
        loadStart : req.query.loadStart,
        loadEnd : req.query.loadEnd,
        limit : limit*1,
        page : page*1
    }
    allocationService.find(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /allocations/:id 개별 배차 조회
   * @apiName findOne
   * @apiGroup allocations
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {Number} id 배차 등록 아이디 
   * 
   * @apiSuccess {Number} id 배차 아이디 
   * @apiSuccess {Number} order_id 오더 아이디 
   * @apiSuccess {Number} offer_id 오퍼 아이디 
   * @apiSuccess {Number} allocator 배차사용자 아이디 
   * @apiSuccess {DATE} allocated 배차시간 
   * @apiSuccess {String} type 공유(주선소/화주), 일반(주선소/화주)
   * @apiSuccess {DATE} load_datetime 화물 적재 시간
   * @apiSuccess {String} load_method 상차방법 지게차/수작업/호이스트/크레인/컨베이어
   * @apiSuccess {Number} is_shuttle 왕복여부
   * @apiSuccess {Date} unload_datetime 화물 하차 시간 
   * @apiSuccess {String} unload_method 하차방법 지게차/수작업/호이스트/크레인/컨베이어  
   * @apiSuccess {String} source 상차지
   * @apiSuccess {String} destination 하차지
   * @apiSuccess {Number} goods_id 화물아이디
   * @apiSuccess {Number} weight 무게
   * @apiSuccess {DATE} freight 지불방식
   * @apiSuccess {Number} fee 운송료(운임)
   * @apiSuccess {Number} broker_id 주선소 아이디
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} orderer 등록자 아이디
   * @apiSuccess {Date} order_day 등록 일시
   * @apiSuccess {String} type 일반/공차
   * @apiSuccess {Number} truck_id 트럭 아이디
   * @apiSuccess {Number} offerrer 차주아이디
   * @apiSuccess {Date} offer_day 오퍼 일시
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": [{
   *  
   * }],
   * "info": {
   *    "size": 2
   * }
   *}
   * 
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ER_SP_UNDECLARED_VAR: Undeclared variable: NaN"
   *  ]}
   * 
   */
  router.get('/:id', function(req, res) {
    var param = {
        id : req.params.id,
    }
    allocationService.findOne(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * 배차  
   * 오더를 통해서 배차하는 것과 오퍼를 통해서 배차하는 것으로 나뉘는데, 
   * 오더와 오퍼가 이미 존재하는 경우가 있다면 이 api를 사용한다. 
   * (TODO : 향후, 오더와 공차를 연결시켜주는 기능이 필요할 듯)
   * 오더를 통해서 배차되는 api는 orders.js에 ..
   * 오퍼를 통해서 배차되는 api는 offers.js에 ..
   */
  /**
   * @api {post} /allocations 배차 등록
   * @apiName findOne
   * @apiGroup allocations
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, truck_user, operator, admin
   * 
   * @apiParam {Number} orderId 오더 아이디 
   * @apiParam {Number} offerId 오퍼 아이디 
   * @apiParam {Number} userId 사용자 아이디 
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
   * {code: 22000,
   *  message: [
   *    "Query Error : ER_SP_UNDECLARED_VAR: Undeclared variable: NaN"
   *  ]}
   * 
   */
  router.post('/', function(req, res) {
    if (check.undefined(req.body.orderId) || 
        check.undefined(req.body.offerId)) {
      RestResponse.failure(res, req.query.uuid, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        orderId : req.body.orderId*1,
        offerId : req.body.offerId*1,
        userId : req.cookies.id
    }
    var permission = {
        allow : ['broker', 'truck_user', 'operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      allocationService.createAllocation(param, function(){
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  

  /**
   * @api {delete} /allocations 배차 취소
   * @apiName deleteAllocation
   * @apiGroup allocations
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, truck_user, operator, admin
   * 
   * @apiParam {Number} id 배차 아이디 
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
   * {code: 22000,
   *  message: [
   *    "Query Error : ER_SP_UNDECLARED_VAR: Undeclared variable: NaN"
   *  ]}
   * 
   */
  router.delete('/:id', function(req, res) {
    var param = {
        id : req.params.id
    }
    allocationService.deleteAllocation(param, function() {
      RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

}