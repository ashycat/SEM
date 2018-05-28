'use strict';

var RestResponse = require('../../lib/RestResponse');
var truckDao = require('../../dao/truck');
var userAuth = require('../../dao/userauth');
var messageDao = require('../../dao/message');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var checkPermission = require('../../lib/checkPermission');
var logger = require('../../lib/logger');
var truckService = require('../../services/truckService');

module.exports = function(router) {

  /**
   * @api {get} /trucks 트럭 목록 조회
   * @apiName listTruck
   * @apiGroup broker truck
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager 
   *
   * @apiParam {Number} page 페이지
   * @apiParam {Number} limit 페이지당 조회 개수
   *
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   *     "code": 0,
   *     "contents": [
   *         {
   *             "id": 1,
   *             "type": "haha",
   *             "weight": 5,
   *             "model": "마이티",
   *             "car_number": "가77 5556",
   *             "registered_number": "2312412",
   *             "owner_id": 2,
   *             "broker_id": 1,
   *             "status": "ACTIVE",
   *             "creator": 1,
   *             "created": "2015-06-14T13:45:28.000Z",
   *             "modifier": 1,
   *             "modified": "2015-08-26T13:23:58.000Z"
   *         },
   *         {
   *             "id": 2,
   *             "type": "haha",
   *             "weight": 5,
   *             "model": "스카니아",
   *             "car_number": "가77 5552",
   *             "registered_number": "1123123123213123",
   *             "owner_id": 1,
   *             "broker_id": 1,
   *             "status": "ACTIVE",
   *             "creator": 1,
   *             "created": "2015-06-14T13:45:00.000Z",
   *             "modifier": 1,
   *             "modified": "2015-06-27T07:22:22.000Z"
   *         }
   *     ],
   *     "info": {
   *         "size": 2
   *     }
   * }
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~~"
   *  ]}
   * 
   */  
  router.get('/', function(req, res) {
    if (req.query.userId) {
      var param = {
          userId : req.cookies.id
      }
      truckDao.listByUserId(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    } else {
      var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
      var page = check.undefined(req.query.page) ? '0' : req.query.page;
      var param = {
          limit : limit*1,
          page : page*1
      }
      truckDao.list(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }
  });
  
  /**
   * @api {get} /trucks/find 트럭 검색
   * @apiName findTruck
   * @apiGroup broker truck
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager 
   *
   * @apiParam {String} model 모델명
   * @apiParam {String} brokerId 주선소 아이디
   * @apiParam {Number} page 페이지
   * @apiParam {Number} limit 페이지당 조회 개수
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   *     "code": 0,
   *     "contents": [
   *         {
   *             "id": 1,
   *             "type": "haha",
   *             "weight": 5,
   *             "model": "마이티",
   *             "car_number": "가77 5556",
   *             "registered_number": "2312412",
   *             "owner_id": 2,
   *             "broker_id": 1,
   *             "status": "ACTIVE",
   *             "creator": 1,
   *             "created": "2015-06-14T13:45:28.000Z",
   *             "modifier": 1,
   *             "modified": "2015-08-26T13:23:58.000Z"
   *         },
   *         {
   *             "id": 2,
   *             "type": "haha",
   *             "weight": 5,
   *             "model": "스카니아",
   *             "car_number": "가77 5552",
   *             "registered_number": "1123123123213123",
   *             "owner_id": 1,
   *             "broker_id": 1,
   *             "status": "ACTIVE",
   *             "creator": 1,
   *             "created": "2015-06-14T13:45:00.000Z",
   *             "modifier": 1,
   *             "modified": "2015-06-27T07:22:22.000Z"
   *         }
   *     ],
   *     "info": {
   *         "size": 2
   *     }
   * }
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~~"
   *  ]}
   * 
   */  
  router.get('/find', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        model : req.query.model,
        brokerId : req.query.brokerId,
        userId : req.cookies.id,
        limit : limit*1,
        page : page*1
    }
    truckDao.find(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /trucks/:id 개별 트럭 조회
   * @apiName listTruck
   * @apiGroup broker truck
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager 
   *
   * @apiParam {Number} page 페이지
   * @apiParam {Number} limit 페이지당 조회 개수
   *
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   *     "code": 0,
   *     "contents": { 
   *         "id": 1,
   *         "type": "haha",
   *         "weight": 5,
   *         "model": "마이티",
   *         "car_number": "가77 5556",
   *         "registered_number": "2312412",
   *         "owner_id": 2,
   *         "broker_id": 1,
   *         "status": "ACTIVE",
   *         "creator": 1,
   *         "created": "2015-06-14T13:45:28.000Z",
   *         "modifier": 1,
   *         "modified": "2015-08-26T13:23:58.000Z"
   *     }
   * }
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~~"
   *  ]}
   * 
   */    
  router.get('/:id', function(req, res) {
    var param = {
        id : req.params.id
    }
    truckDao.one(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /trucks 트럭 등록
   * @apiName createTruck
   * @apiGroup broker truck
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager 
   *
   * @apiParam {String} type 트럭종류
   * @apiParam {number} weight 무게 ton
   * @apiParam {String} model 모델명
   * @apiParam {String} carNumber 차량번호판
   * @apiParam {String} registeredNumber 차량등록번호
   * @apiParam {String} ownerId 차량소유자
   * @apiParam {String} brokerId 주선소 아이디
   * @apiParam {String} creator 생성자
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":"ok"}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~~"
   *  ]}
   * 
   */
  router.post('/', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    if (check.undefined(req.body.type) || 
        check.undefined(req.body.weight) || 
        check.undefined(req.body.model) || 
        check.undefined(req.body.carNumber) ||
        check.undefined(req.body.registeredNumber) ||
        check.undefined(req.body.ownerId)
        ) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        type : req.body.type.trim(),
        weight : req.body.weight.trim()*1.0,
        model : req.body.model.trim(),
        carNumber : req.body.carNumber.trim(),
        registeredNumber : req.body.registeredNumber.trim(),
        ownerId : req.body.ownerId*1,
        userId : req.cookies.id,
        brokerId : req.body.brokerId
    };
    var permission = {
        allow : ['broker_teller', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req); 
    userAuth.isAuthenticate(permission, function() {
      truckDao.create(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /trucks/:truck_id 트럭 수정
   * @apiName updateTruck
   * @apiGroup broker truck
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager 
   *
   * @apiParam {String} id 트럭 아이디
   * @apiParam {String} type 트럭종류
   * @apiParam {number} weight 무게 ton
   * @apiParam {String} model 모델명
   * @apiParam {String} carNumber 차량번호판
   * @apiParam {String} registeredNumber 차량등록번호
   * @apiParam {String} ownerId 차량소유자
   * @apiParam {String} status 상태 ( ACTIVE | STOP | DELETE )
   * @apiParam {String} brokerId 주선소 아이디
   * @apiParam {String} modifier 수정자
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":"ok"}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~~"
   *  ]}
   * 
   */
  router.put('/:id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    if (check.undefined(req.body.type) || 
        check.undefined(req.body.weight) || 
        check.undefined(req.body.model) || 
        check.undefined(req.body.carNumber) ||
        check.undefined(req.body.registeredNumber) ||
        check.undefined(req.body.ownerId)
        ) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        type : req.body.type.trim(),
        weight : req.body.weight.trim()*1.0,
        model : req.body.model.trim(),
        carNumber : req.body.carNumber.trim(),
        registeredNumber : req.body.registeredNumber.trim(),
        ownerId : req.body.ownerId*1,
        status : req.body.status,
        userId : req.cookies.id,
        id : req.params.id
    }
    // 이 api를 이용할 수 있는 권한 관리자, 운영자, 주선소
    var permission = {
        allow : ['broker_teller, broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      truckService.stop(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /trucks/:truck_id 트럭 삭제
   * @apiName updateTruck
   * @apiGroup broker truck
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager 
   *
   * @apiParam {String} id 트럭 아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":"ok"}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~~"
   *  ]}
   * 
   */
  router.delete('/:id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = {
        id : req.params.id
    }
    truckDao.delete(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

}