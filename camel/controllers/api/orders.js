'use strict';

var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var orderService = require('../../services/orderService');
var allocationService = require('../../services/allocationService');
var checkPermission = require('../../lib/checkPermission');
var logger = require('../../lib/logger');

module.exports = function(router) {

  /**
   * @api {get} /orders 오더 목록 조회
   * @apiName getOrderList
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {String} type 오더 종류
   * @apiParam {String} qType 오더 검색자 종류 (broker, truck_user, admin)
   * @apiParam {Number} page 페이지
   * @apiParam {Number} limit 페이지당 조회 개수
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { code: 0,
   *  contents: [{ 
   *    id: 21, type: 'type', load_datetime: '2015-09-10T03:12:12.000Z',
   *    load_method: '123', unload_datetime: '2015-09-11T03:12:12.000Z', unload_method: '123',
   *    is_shuttle: 0, is_quick: 0, source_id: 123,
   *    destination_id: 123, goods_id: 29, weight: 123,
   *    payment_type: 123, freight: 123, fee: 123,
   *    broker_id: 1, status: 'ACTIVE', is_alloc: 0,
   *    creator: 1, created: '2015-09-21T17:57:31.000Z',
   *    modifier: 1, modified: '2015-09-21T17:57:31.000Z',
   *    source: '강남구', destination: '강남구' 
   *    },
   *    { 
   *    id: 22, type: 'type', load_datetime: '2015-09-10T03:12:12.000Z',
   *    load_method: '123', unload_datetime: '2015-09-11T03:12:12.000Z', unload_method: '123',
   *    is_shuttle: 0, is_quick: 0, source_id: 123,
   *    destination_id: 123, goods_id: 29, weight: 123,
   *    payment_type: 123, freight: 123, fee: 123,
   *    broker_id: 1, status: 'ACTIVE', is_alloc: 0,
   *    creator: 1, created: '2015-09-21T17:57:31.000Z',
   *    modifier: 1, modified: '2015-09-21T17:57:31.000Z',
   *    source: '강남구', destination: '강남구' }
   *    ]    
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
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        type : req.query.type,
        limit : limit*1,
        page : page*1,
        qType : req.query.qType,
        userId : req.cookies.id,
    }
    if (!check.undefined(req.query.brokerId)) {
      param.brokerId = req.query.brokerId*1; 
    }
    if (!check.undefined(req.query.weight)) {
      param.weight = req.query.weight*1; 
    }
    
    if (req.query.qType == 'broker') {
      param.brokerId = req.cookies.id*1;
    }
    orderService.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /orders/find 오더 검색
   * @apiName getOrderList
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {String} type 오더 종류
   * @apiParam {Boolean} isShuttle 왕복 여부 
   * @apiParam {Number} freightStart 화물 중량 범위 시작  
   * @apiParam {Number} freightEnd 화물 중량 범위 끝 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { code: 0,
   *  contents: [{ 
   *    id: 21, type: 'type', load_datetime: '2015-09-10T03:12:12.000Z',
   *    load_method: '123', unload_datetime: '2015-09-11T03:12:12.000Z', unload_method: '123',
   *    is_shuttle: 0, is_quick: 0, source_id: 123,
   *    destination_id: 123, goods_id: 29, weight: 123,
   *    payment_type: 123, freight: 123, fee: 123,
   *    broker_id: 1, status: 'ACTIVE', is_alloc: 0,
   *    creator: 1, created: '2015-09-21T17:57:31.000Z',
   *    modifier: 1, modified: '2015-09-21T17:57:31.000Z',
   *    source: '강남구', destination: '강남구' 
   *    },
   *    { 
   *    id: 22, type: 'type', load_datetime: '2015-09-10T03:12:12.000Z',
   *    load_method: '123', unload_datetime: '2015-09-11T03:12:12.000Z', unload_method: '123',
   *    is_shuttle: 0, is_quick: 0, source_id: 123,
   *    destination_id: 123, goods_id: 29, weight: 123,
   *    payment_type: 123, freight: 123, fee: 123,
   *    broker_id: 1, status: 'ACTIVE', is_alloc: 0,
   *    creator: 1, created: '2015-09-21T17:57:31.000Z',
   *    modifier: 1, modified: '2015-09-21T17:57:31.000Z',
   *    source: '강남구', destination: '강남구' }
   *    ]    
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
    var param = {
        type : req.query.type,
        isShuttle : req.query.isShuttle,
        freightStart : (check.undefined(req.query.freightStart) ? undefined : req.query.freightStart*1),
        freightEnd : (check.undefined(req.query.freightEnd) ? undefined : req.query.freightEnd*1),
        brokerId : req.query.brokerId
    }
    orderService.find(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /orders/:id 개별 오더 조회
   * @apiName getOrder
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {String} id 오더 조회
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { code: 0,
   *  contents: 
   *  { id: 21, type: 'type', load_datetime: '2015-09-10T03:12:12.000Z',
   *   load_method: '123', unload_datetime: '2015-09-11T03:12:12.000Z', unload_method: '123',
   *   is_shuttle: 0, is_quick: 0, source_id: 123,
   *   destination_id: 123, goods_id: 29, weight: 123,
   *   payment_type: 123, freight: 123, fee: 123,
   *   broker_id: 1, status: 'ACTIVE', is_alloc: 0,
   *   creator: 1, created: '2015-09-21T17:57:31.000Z',
   *   modifier: 1, modified: '2015-09-21T17:57:31.000Z',
   *   source: '강남구', destination: '강남구' 
   *   } 
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
    orderService.findOne(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /orders 오더등록
   * @apiName createOrder
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {String} type 주문 타입(SHARE, GROUP, NORMAL)
   * @apiParam {String} consigner_id 주선소 그룹 아이디
   * @apiParam {String} goods_category_id 주선소 그룹 아이디
   * @apiParam {String} goods_weight 무게j
   * @apiParam {String} length 길이
   * @apiParam {String} sender_name 화주이름
   * @apiParam {String} sender_handphone
   * @apiParam {String} sender_telephone
   * @apiParam {String} sendee_name 화문받는 사람 이름 
   * @apiParam {String} sendee_handphone
   * @apiParam {String} sendee_telephone
   * @apiParam {String} description
   * @apiParam {String} source_id 상차지 주소 아이디
   * @apiParam {String} desctination_id 하차지 주소 아이디
   * @apiParam {String} load_datetime 화물 적재 시간
   * @apiParam {String} load_method 상차 방법(지게차,수작업,호이스트,크레인,컨베이어)
   * @apiParam {String} unload_datetime 화문 하차 시간
   * @apiParam {String} unload_method 상차 방법(지게차,수작업,호이스트,크레인,컨베이어) 
   * @apiParam {String} order_weightl 무게
   * @apiParam {String} truckCount
   * @apiParam {String} payment_type 지불방식
   * @apiParam {String} freight 운송료(운임)
   * @apiParam {String} fee 수수료
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

    if (// 화물
        check.undefined(req.body.type) ||
        check.undefined(req.body.consigner_id) ||
        check.undefined(req.body.goods_category_id) ||
        check.undefined(req.body.goods_weight) ||
        check.undefined(req.body.length) ||
        check.undefined(req.body.sender_name) ||
        check.undefined(req.body.sender_handphone) ||
        check.undefined(req.body.sender_telephone) ||
        check.undefined(req.body.sendee_name) ||
        check.undefined(req.body.sendee_handphone) ||
        check.undefined(req.body.sendee_telephone) ||
        check.undefined(req.body.description) ||
        // 차량 
        check.undefined(req.body.source_id) ||
        check.undefined(req.body.destination_id) ||
        check.undefined(req.body.load_datetime) ||
        check.undefined(req.body.unload_datetime) ||
        check.undefined(req.body.load_method) ||
        check.undefined(req.body.unload_method) ||
        check.undefined(req.body.order_weight) ||
        check.undefined(req.body.truckCount) ||
        check.undefined(req.body.payment_type) ||
        check.undefined(req.body.freight) ||
        check.undefined(req.body.fee) 
        ) {
      RestResponse.failure(res, req.query.uuid, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    
    var param = req.body;
    // optional param
    param.is_mix = (check.undefined(req.query.is_mix) ? false : (req.query.is_mix? 1: 0));
    param.is_quick = (check.undefined(req.query.is_quick) ? 0 : (req.query.is_quick? 1: 0));
    param.is_shuttle = (check.undefined(req.query.is_shuttle) ? 0 : (req.query.is_shuttle? 1: 0));
    param.userId = req.cookies.id*1;
    if (check.undefined(req.body.broker_id)) {
      param.broker_id = req.cookies.id*1;
    } else {
      param.broker_id = req.body.broker_id*1;
    }


    var permission = {
        allow : ['broker_teller', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      orderService.create(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
  /**
   * @api {put} /orders/:id 오더수정
   * @apiName updateOrder
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {String} goods_id 상품 아이디
   * @apiParam {String} order_id 주문 아이디
   * @apiParam {String} type 주문 타입(SHARE, GROUP, NORMAL)
   * @apiParam {String} consigner_id 주선소 그룹 아이디
   * @apiParam {String} goods_category_id 주선소 그룹 아이디
   * @apiParam {String} goods_weight 무게j
   * @apiParam {String} length 길이
   * @apiParam {String} sender_name 화주이름
   * @apiParam {String} sender_handphone
   * @apiParam {String} sender_telephone
   * @apiParam {String} sendee_name 화문받는 사람 이름 
   * @apiParam {String} sendee_handphone
   * @apiParam {String} sendee_telephone
   * @apiParam {String} description
   * @apiParam {String} source_id 상차지 주소 아이디
   * @apiParam {String} desctination_id 하차지 주소 아이디
   * @apiParam {String} load_datetime 화물 적재 시간
   * @apiParam {String} load_method 상차 방법(지게차,수작업,호이스트,크레인,컨베이어)
   * @apiParam {String} unload_datetime 화문 하차 시간
   * @apiParam {String} unload_method 상차 방법(지게차,수작업,호이스트,크레인,컨베이어) 
   * @apiParam {String} order_weightl 무게
   * @apiParam {String} truckCount
   * @apiParam {String} payment_type 지불방식
   * @apiParam {String} freight 운송료(운임)
   * @apiParam {String} fee 수수료
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
        check.undefined(req.body.load_datetime) ||
        check.undefined(req.body.load_method) ||
        check.undefined(req.body.unload_datetime) ||
        check.undefined(req.body.unload_method) ||
        check.undefined(req.body.is_shuttle) ||
        check.undefined(req.body.source_id) ||
        check.undefined(req.body.destination_id) ||
        check.undefined(req.body.order_weight) ||
        check.undefined(req.body.freight) ||
        check.undefined(req.body.fee)) {
      RestResponse.failure(res, req.query.uuid, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }

    var param = req.body;
    param.userId = req.cookies.id*1;
    if (check.undefined(req.body.broker_id)) {
      param.broker_id = req.cookies.id*1;
    } else {
      param.broker_id = req.body.broker_id*1;
    }

    var permission = {
        allow : ['broker_teller', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      orderService.update(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * (status를 'DELETE'로 변경)
   * @api {delete} /orders/:id 오더 삭제 
   * @apiName deleteOrder
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
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
    var param = {
        id : req.params.id
    }
    var permission = {
        allow : ['broker', 'operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    userAuth.isAuthenticate(permission, function() {
      orderService.delete(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {post} /orders/:id/allocations 오더에서 배차 등록
   * @apiName allocateOrder
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {Number} truckId 트럭 아이디
   * @apiParam {String} type offer 종류 
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
  router.post('/:id/allocations', function(req, res) {
    if (check.undefined(req.body.truckId) || 
        check.undefined(req.body.type)) {
      RestResponse.failure(res, req.query.uuid, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        orderId : req.params.id,
        truckId : req.body.truckId*1,
        type : req.body.type.trim(),
        userId : req.cookies.id*1
    }
    var permission = {
        allow : ['operator', 'admin', 'truck_user', 'broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }

    userAuth.isAuthenticate(permission, function() {
      orderService.allocate(param, function(){
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /orders/:id/offers 오더에 배차된 차량 정보 조회
   * @apiName getallocatedTruckInfo
   * @apiGroup order
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {Number} truckId 트럭 아이디
   * @apiParam {String} type offer 종류 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":{
   *     "id" : 1,
   *     "type" : "car type",
   *     "model" : "poter",
   *     "car_number" : "12가 1234",
   *     "registered_number" : "1234-12321",
   *     "owner_id" : 1,
   *     "broker_id" : 2,
   *     "status" : "ACTIVE", 
   *     "creator" : 3,
   *     "created" : "2015-06-14T17:57:31.000Z",
   *     "modifier" : 3,
   *     "modified" : "2015-06-14T17:57:31.000Z",
   *     "user_name" : "홍길동",
   *     "handphone" : "010-1234-1234",
   *     "telephone" : "02-1234-1234"
   *   }
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
  router.get('/:id/offers', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        id : req.params.id,
        userId : req.cookies.id,
    }
    allocationService.allocatedOffer(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
}
