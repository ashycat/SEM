'use strict';

var debug_param = require('debug')('param');
var debug_result = require('debug')('result');
var logger = require('../../lib/logger');
var RestResponse = require('../../lib/RestResponse');
var brokerService = require('../../services/brokerService');
var consignerService = require('../../services/consignerService');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var checkPermission = require('../../lib/checkPermission');
var userAuth = require('../../dao/userauth');

module.exports = function(router) {

  /**
   * @api {get} /brokers 주선소 목록 조회  
   * @apiName listBrokers
   * @apiGroup broker
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   * 
   * @apiParam {Number} limit 한페이지 개수
   * @apiParam {Number} page 페이지
   * 
   * @apiSuccess {String} name 주선소명  
   * @apiSuccess {String} telephone 대표 전화번호 (option)   
   * @apiSuccess {String} handphone 대표 핸드폰번호 (option)
   * @apiSuccess {Number} address_id 주소 id
   * @apiSuccess {String} address_detail 주소 상세 
   * @apiSuccess {String} post_code 우편번호 
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 변경자 아이디  
   * @apiSuccess {Date} modified 변경일시  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[{
   *  id: 1,
   *  name: "주선소1",
   *  telephone: "11111111112",
   *  handphone: "01011112223",
   *  address: null,
   *  address_detail: "",
   *  post_code: "",
   *  status: "ACTIVE",
   *  creator: 1,
   *  created: "2015-06-14T08:17:11.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:08.000Z"
   *  },
   *  {
   *  id: 2,
   *  name: "주선소2",
   *  telephone: "07021231234",
   *  handphone: "01021231231",
   *  address: null,
   *  address_detail: null,
   *  post_code: null,
   *  status: "ACTIVE",
   *  creator: 1,
   *  created: "2015-06-15T15:27:32.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:05.000Z"
   *  }
   * ]}
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
        limit : limit*1,
        page : page*1
    }
    var permission = {
        allow : ['admin', 'operator', 'salesman'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    };
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerService.list(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /brokers/find 주선소 검색   
   * @apiName findBrokers
   * @apiGroup broker
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   * 
   * @apiParam {String} name 주선소명 (option) 
   * @apiParam {Number} address_id 주소 아이디 (option)
   * @apiParam {String} post_code 우편번호 (option)
   * @apiParam {Number} limit 한페이지 개수 (option)
   * @apiParam {Number} page 페이지 (option)
   * 
   * @apiSuccess {String} name 주선소명  
   * @apiSuccess {String} telephone 대표 전화번호 (option)   
   * @apiSuccess {String} handphone 대표 핸드폰번호 (option)
   * @apiSuccess {Number} address_id 주소 id
   * @apiSuccess {String} address_detail 주소 상세 
   * @apiSuccess {String} post_code 우편번호 
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 변경자 아이디  
   * @apiSuccess {Date} modified 변경일시  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[{
   *  id: 1,
   *  name: "주선소1",
   *  telephone: "11111111112",
   *  handphone: "01011112223",
   *  address: null,
   *  address_detail: "",
   *  post_code: "",
   *  status: "ACTIVE",
   *  creator: 1,
   *  created: "2015-06-14T08:17:11.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:08.000Z"
   *  },
   *  {
   *  id: 2,
   *  name: "주선소2",
   *  telephone: "07021231234",
   *  handphone: "01021231231",
   *  address: null,
   *  address_detail: null,
   *  post_code: null,
   *  status: "ACTIVE",
   *  creator: 1,
   *  created: "2015-06-15T15:27:32.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:05.000Z"
   *  }
   * ]}
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
        name : req.query.name,
        address_id : req.query.address_id,
        post_code : req.query.post_code,
        limit : limit*1,
        page : page*1
    }
    var permission = {
        allow : ['admin', 'operator', 'salesman'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    };
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerService.findAll(param, function(data) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   *  
   */
  /**
   * @api {get} /brokers/:id 개별 주선소 조회   
   * @apiName getBroker
   * @apiGroup broker
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   * 
   * @apiSuccess {String} name 주선소명  
   * @apiSuccess {String} telephone 대표 전화번호 (option)   
   * @apiSuccess {String} handphone 대표 핸드폰번호 (option)
   * @apiSuccess {Number} address_id 주소 id
   * @apiSuccess {String} address_detail 주소 상세 
   * @apiSuccess {String} post_code 우편번호 
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 변경자 아이디  
   * @apiSuccess {Date} modified 변경일시  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":{
   *  id: 1,
   *  name: "주선소1",
   *  telephone: "11111111112",
   *  handphone: "01011112223",
   *  address: null,
   *  address_detail: "",
   *  post_code: "",
   *  status: "ACTIVE",
   *  creator: 1,
   *  created: "2015-06-14T08:17:11.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:08.000Z"
   *  }
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
    var permission = {
        allow : ['admin', 'operator', 'salesman'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    };
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerService.findOne(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /brokers 주선소 등록   
   * @apiName createBroker
   * @apiGroup broker
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, user
   * 
   * @apiParam {String} name 주선소명  
   * @apiParam {String} telephone 대표 전화번호 (option)   
   * @apiParam {String} handphone 대표 핸드폰번호 (option)
   * @apiParam {Number} address_id 주소 id
   * @apiParam {String} address_detail 주소 상세 
   * @apiParam {String} post_code 우편번호 
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
    
    if (check.undefined(req.body.name) || 
        check.undefined(req.body.telephone) ||
        check.undefined(req.body.handphone)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    
    var param = req.body;
    
    var permission = {
        allow : ['operator', 'admin', 'salesman'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerService.createBroker(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /brokers/:id 주선소 수정  
   * @apiName updateBroker
   * @apiGroup broker
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, broker_manager
   * 
   * @apiParam {String} name 주선소명  
   * @apiParam {String} telephone 대표 전화번호 (option)   
   * @apiParam {String} handphone 대표 핸드폰번호 (option)
   * @apiParam {Number} address_id 주소 id
   * @apiParam {String} address_detail 주소 상세 
   * @apiParam {String} post_code 우편번호 
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
    if (check.undefined(req.body.name) || 
        check.undefined(req.body.telephone) ||
        check.undefined(req.body.handphone)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
      name : req.body.name.trim(),
      telephone : req.body.telephone.trim(),
      handphone : req.body.handphone.trim(),
      id : req.params.id,
      userId : req.cookies.id
    }
    var permission = {
        allow : ['operator', 'admin', 'salesman'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerService.updateBroker(param, function(){
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * 주선소 삭제 (status를 'DELETE'로 변경)
   * TODO : 향후 불필요한 개인 정보는 지우는 기능이 들어가야 한다.
   * 
   * @api {delete} /brokers/:id 주선소 삭제  
   * @apiName deleteBroker
   * @apiGroup broker
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, broker_manager
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
    brokerService.deleteBroker(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /brokers/:broker_id/members 주선소 맴버 조회  
   * @apiName listBrokerMembers
   * @apiGroup broker member
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiSuccess {String} user_id 사용자 아이디 
   * @apiSuccess {String} user_name 사용자 이름  
   * @apiSuccess {String} user_email 사용자 이메일  
   * @apiSuccess {String} role 권한 (manager/teler)
   * @apiSuccess {Date} creator 생성자 
   * @apiSuccess {String} created 생성일시 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"user_id":"user1","user_name":"홍길동","role":"manager","created":"2015-07-12T14:06:29.000Z","creator":1},
   *   {"user_id":"user2","user_name":"홍길자","role":"teler","created":"2015-07-12T15:06:29.000Z","creator":1}
   * ]}
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
  router.get('/:broker_id/members', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1,
        broker_id : req.params.broker_id
    }
    brokerService.showMembers(param, function(data, info){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 
  
  /**
   * @api {post} /brokers/:broker_id/members 주선소 맴버 추가 
   * @apiName addBrokerMember 
   * @apiGroup broker member
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {Number} user_id 사용자 아이디 
   * @apiParam {String} role 권한 (manager/teler)
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
  router.post('/:broker_id/members', function(req, res) {
    var param = {
        broker_id : req.params.broker_id,
        broker_role : req.body.broker_role,
        user_id : req.body.user_id,
        creator : req.body.creator
    }
    
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerService.addMember(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message){
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      console.log("not permission", code, message);
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 
  
  /**
   * @api {put} /brokers/:broker_id/members/:user_id 주선소 맴버 권한 수정  
   * @apiName updateBrokerMemberRole 
   * @apiGroup broker member
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} role 권한 (manager/teler)
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
  router.put('/:broker_id/members/:user_id', function(req, res) {
    var param = {
        broker_id : req.params.broker_id,
        broker_role : req.query.broker_role,
        user_id : req.params.user_id,
        creator : req.query.creator
    }
    
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerService.updateMember(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message){
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      console.log("not permission", code, message);
      RestResponse.failure(res, req.query.uuid, code, message);
    }); 
  });
  
  /**
   * @api {delete} /brokers/:broker_id/members/:user_id 주선소 맴버 삭제 
   * @apiName deleteBrokerMember
   * @apiGroup broker member
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
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
  router.delete('/:broker_id/members/:user_id', function(req, res) {
    var param = {
        broker_id : req.params.broker_id,
        user_id : req.params.user_id
    }
    brokerService.deleteMember(param, function() { 
      RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok')
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 
  
  /**
   * @api {get} /brokers/members/find 주선소 등록 가능한 멤버 조회  
   * @apiName findBrokerMembers
   * @apiGroup broker member
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} user_id 사용자 아이디 
   * @apiParam {String} user_name 사용자명 
   * 
   * @apiSuccess {String} user_id 사용자 아이디 
   * @apiSuccess {String} user_name 사용자 이름  
   * @apiSuccess {String} user_email 사용자 이메일  
   * @apiSuccess {Date} creator 생성자 
   * @apiSuccess {String} created 생성일시 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"user_id":"user1","user_name":"홍길동","created":"2015-07-12T14:06:29.000Z","creator":1},
   *   {"user_id":"user2","user_name":"홍길자","created":"2015-07-12T15:06:29.000Z","creator":1}
   * ]}
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
  router.get('/members/find', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1,
        user_id : req.query.user_id,
        user_name : req.query.user_name
    }

    brokerService.findMembers(param, function(data, info){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
  /**
   * @api {get} /brokers/:broker_id/consigners 고객목록조회 & 고객검색
   * @apiName listBrokerConsigner
   * @apiGroup broker member
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} broker_id 브로커 아이디
   * @apiParam {String} type 조회모드(null|find)
   * 
   * @apiSuccess {String} name 거래처명
   * @apiSuccess {String} fax 팩스 번화
   * @apiSuccess {String} ceo_name 대표자명
   * @apiSuccess {String} license 사업자번호
   * @apiSuccess {Date} creator 생성자 
   * @apiSuccess {String} created 생성일시 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *  { id: 3, name: '123', phone: '123', fax: '123', broker_id: 1, status: 'ACTIVE', creator: 1, created: '2015-08-17T01:16:33.000Z', modifier: 1, modified: '2015-08-17T01:27:53.000Z'}
   *  { id: 4, name: '123', phone: '123', fax: '123', broker_id: 1, status: 'ACTIVE', creator: 1, created: '2015-08-17T01:16:33.000Z', modifier: 1, modified: '2015-08-17T01:27:53.000Z'},
   * ]}
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
  router.get('/:broker_id/consigners', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.params:", req.params);
    
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1,
        broker_id : req.params.broker_id,
        type : req.query.type,
        name : req.query.name
    }
    
    if( param.type == 'find'){ // 조건검색
      consignerService.find(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
      
    }else{ // 전체조회
      consignerService.list(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
      
    }
  });
  
  /**
   * @api {delete} /brokers/:broker_id/consigners/:consigner_id 주선소에 속한 화주 삭제
   * @apiName deleteBrokerConsigner
   * @apiGroup broker member
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} broker_id 브로커 아이디
   * @apiParam {String} consigner_id 화주 아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   * ]}
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
  router.delete('/:broker_id/consigners/:consigner_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.params:", req.params);
    var param = {
        broker_id : req.params.broker_id,
        consigner_id : req.params.consigner_id
    }
    consignerService.deleteConsigner(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /brokers/:broker_id/consigners 화주등록
   * @apiName createConsigner
   * @apiGroup broker consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} name 거래처명
   * @apiParam {String} phone 대표전화번호
   * @apiParam {String} fax 팩스 번호
   * @apiParam {String} broker_id 주선소 아이디
   * @apiParam {String} creator 생성자 아이디
   * @apiParam {String} business_taxtype  구분:1(간이과세), 2(일반과세)
   * @apiParam {String} business_ceo_name 대표자명
   * @apiParam {String} business_name 상호명
   * @apiParam {String} business_license 사업자번호
   * @apiParam {String} business_condition 업태
   * @apiParam {String} business_type 업종
   * @apiParam {String} business_address_id 기존 아이디
   * @apiParam {String} business_address_detail 주소 상세
   * @apiParam {String} member_name  담당자명
   * @apiParam {String} member_telephone 전화번호
   * @apiParam {String} member_handphone 담당자 휴대전화번호
   * @apiParam {String} member_email 담당자 이메일
   * @apiParam {String} member_description 메모
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   * ]}
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
  router.post('/:broker_id/consigners', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);

    var param = req.body;
    
    var permission = {
        allow : ['broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      consignerService.createConsigner(param, function(data) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 
  
  /**
   * @api {put} /brokers/:broker_id/consigners/:consigner_id 화주수정
   * @apiName updateConsigner
   * @apiGroup broker consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} name 거래처명
   * @apiParam {String} phone 대표전화번호
   * @apiParam {String} fax 팩스 번호
   * @apiParam {String} user_id 로그인 아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   * ]}
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
  router.put('/:broker_id/consigners/:consigner_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.params:", req.params);
    logger.debug("api req.body:", req.body);

    var param = req.body;
    param.broker_id = req.params.broker_id;
    param.consigner_id = req.params.consigner_id;
    
    var permission = {
        allow : ['broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      consignerService.updateConsigner(param, function(data) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 
  
}