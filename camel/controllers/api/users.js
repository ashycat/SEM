'use strict';

var RestResponse = require('../../lib/RestResponse');
var userDao = require('../../dao/user');
var messageService = require('../../services/messageService');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var userService = require('../../services/userService');
var checkPermission = require('../../lib/checkPermission');
var logger = require('../../lib/logger');
var userAuth = require('../../dao/userauth');
var nodemail = require('../../lib/nodemailer');
var randomstring = require("randomstring");
var checkPermission = require('../../lib/checkPermission');
var logger = require('../../lib/logger');
var userAuth = require('../../dao/userauth');

module.exports = function(router) {

  /**
   * @api {get} /users 사용자 목록 조회 
   * @apiName listUsers
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   * 
   * @apiSuccess {Number} id 사용자 시스템 아이디 
   * @apiSuccess {String} user_id 사용자 아이디  
   * @apiSuccess {String} user_name 사용자명  
   * @apiSuccess {String} telephone 전화번호 
   * @apiSuccess {String} handphone 휴대전화번호   
   * @apiSuccess {String} role 권한  
   * @apiSuccess {String} status 상태  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":[  
   *     {  
   *         "id":0,
   *         "user_id":"all",
   *         "user_name":"전체사용자",
   *         "telephone":null,
   *         "handphone":null,
   *         "role":"user",
   *         "status":"ACTIVE"
   *     },
   *     {  
   *         "id":1,
   *         "user_id":"user",
   *         "user_name":"tester",
   *         "telephone":"07011111111",
   *         "handphone":"01011111111",
   *         "role":"user",
   *         "status":"ACTIVE"
   *     }
   *   ],
   *   "info":{  
   *     "size":2
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
  router.get('/', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1
    };
    userService.list(param, function(result){
      RestResponse.success(res, req.query.uuid, errorCode.OK, result);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
    
    userDao.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /users/find 사용자 검색 
   * @apiName findUsers
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   *
   * @apiParam {String} user_id 사용자 아이디 
   * @apiParam {String} user_name 사용자명 
   *
   * @apiSuccess {Number} id 사용자 시스템 아이디 
   * @apiSuccess {String} user_id 사용자 아이디  
   * @apiSuccess {String} user_name 사용자명  
   * @apiSuccess {String} telephone 전화번호 
   * @apiSuccess {String} handphone 휴대전화번호  
   * @apiSuccess {String} role 권한  
   * @apiSuccess {Date} status 상태  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":[  
   *     {  
   *         "id":0,
   *         "user_id":"all",
   *         "user_name":"전체사용자",
   *         "telephone":null,
   *         "handphone":null,
   *         "role":"user",
   *         "status":"ACTIVE"
   *     },
   *     {  
   *         "id":1,
   *         "user_id":"user",
   *         "user_name":"tester",
   *         "telephone":"07011111111",
   *         "handphone":"01011111111",
   *         "role":"user",
   *         "status":"ACTIVE"
   *     }
   *   ],
   *   "info":{  
   *     "size":2
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
  router.get('/find', function(req, res) {
    var param = {
        username : req.query.username,
        userId : req.query.userId
    }
    userDao.find(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /users/findByPhone 사용자 검색 
   * @apiName findUsers
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   *
   * @apiParam {String} user_name 사용자명 
   * @apiParam {String} user_phone 사용자명 
   * @apiParam {String} user_email 사용자명 
   *
   * @apiSuccess {Number} id 사용자 시스템 아이디 
   * @apiSuccess {String} user_id 사용자 아이디  
   * @apiSuccess {String} user_name 사용자명  
   * @apiSuccess {String} phone 전화번호 
   * @apiSuccess {String} email  이메일  
   * @apiSuccess {Date} status 상태  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":[  
   *     {  
   *         "id":0,
   *         "user_id":"all",
   *         "user_name":"전체사용자",
   *         "phone":null,
   *         "email":null,
   *         "status":"ACTIVE"
   *     },
   *     {  
   *         "id":1,
   *         "user_id":"user",
   *         "user_name":"tester",
   *         "phone":"01011111111",
   *         "email":"camel@camel.com",
   *         "status":"ACTIVE"
   *     }
   *   ],
   *   "info":{  
   *     "size":2
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
  router.get('/findByPhone', function(req, res) {
    var param = {
        user_name : req.query.user_name,
        email : req.query.email,
        phone : req.query.phone
    }
    userService.findByPhone(param, function(result){
      RestResponse.success(res, req.query.uuid, errorCode.OK, result);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /users/:id/password 비밀번호 수정 
   * @apiName findUsers
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   *
   * @apiParam {String} id 아이디
   * @apiParam {String} password 비밀번호 
   *
   * @apiSuccess {Number} id 사용자 시스템 아이디 
   * @apiSuccess {String} user_id 사용자 아이디  
   * @apiSuccess {String} user_name 사용자명  
   * @apiSuccess {String} phone 전화번호 
   * @apiSuccess {String} email  이메일  
   * @apiSuccess {Date} status 상태  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":[  
   *     {  
   *         "id":0,
   *         "user_id":"all",
   *         "user_name":"전체사용자",
   *         "phone":null,
   *         "email":null,
   *         "status":"ACTIVE"
   *     },
   *     {  
   *         "id":1,
   *         "user_id":"user",
   *         "user_name":"tester",
   *         "phone":"01011111111",
   *         "email":"camel@camel.com",
   *         "status":"ACTIVE"
   *     }
   *   ],
   *   "info":{  
   *     "size":2
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
  router.put('/:id/password', function(req, res) {
    var param = {
        id : req.params.id,
        password: req.query.password
    }
    userService.updatePassword(param, function(result){
      RestResponse.success(res, req.query.uuid, errorCode.OK, result);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /users/:id 사용자 조회 
   * @apiName getUser
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   *
   * @apiSuccess {Number} id 사용자 시스템 아이디 
   * @apiSuccess {String} user_id 사용자 아이디  
   * @apiSuccess {String} user_name 사용자명  
   * @apiSuccess {String} telephone 전화번호 
   * @apiSuccess {String} handphone 휴대전화번호  
   * @apiSuccess {String} role 권한  
   * @apiSuccess {Date} status 상태  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":{  
   *         "id":0,
   *         "user_id":"all",
   *         "user_name":"전체사용자",
   *         "telephone":null,
   *         "handphone":null,
   *         "role":"user",
   *         "status":"ACTIVE"
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
   * 
   *  ]}
   */ 
  router.get('/:id', function(req, res) {
    var param = {
        id : req.params.id
    }
    userDao.one(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /users/unassignbroker 주선소 등록 가능한 유저 조회
   * @apiName listByUnassignBroker
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   *
   * @apiSuccess {Number} id 사용자 시스템 아이디 
   * @apiSuccess {String} user_id 사용자 아이디  
   * @apiSuccess {String} user_name 사용자명  
   * @apiSuccess {String} telephone 전화번호 
   * @apiSuccess {String} handphone 휴대전화번호  
   * @apiSuccess {String} role 권한  
   * @apiSuccess {Date} status 상태  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":{  
   *         "id":0,
   *         "user_id":"all",
   *         "user_name":"전체사용자",
   *         "telephone":null,
   *         "handphone":null,
   *         "role":"user",
   *         "status":"ACTIVE"
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
  router.get('/broker/unassign', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1
    }
    var permission = {
        allow : ['broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      userService.listByUnassignBroker(param, function(data) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /users 사용자 등록 
   * @apiName createUser
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   *
   * @apiParam {String} user_id 사용자 아이디 
   * @apiParam {String} password 사용자 비밀번호  
   * @apiParam {String} user_name 사용자명 
   * @apiParam {String} phone 전화번호  
   * @apiParam {String} email 이메일 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":"ok"
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
  router.post('/', function(req, res) {
    if (check.undefined(req.body.user_id) || 
        check.undefined(req.body.user_name) || 
        check.undefined(req.body.password) || 
        check.undefined(req.body.phone) || 
        check.undefined(req.body.email)
        ) {
      RestResponse.failure(res, req.query.uuid, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var actionKey = randomstring.generate(8);
    var param = {
        user_id : req.body.user_id.trim(),
        user_name : req.body.user_name.trim(),
        password : req.body.password.trim(),
        phone : req.body.phone.trim(),
        email : req.body.email.trim(),
        action_key : actionKey.trim()
    };

    userService.create(param, function(result){
      console.log('userService result', result);
      var link = "http://localhost:8000/api/users/" + result.id + "/checkActionKey/" + param.action_key;
      var mailOptions = {
          from: 'suchang.jeong <suchang.jeong@gmail.com>', // sender address
          to: req.body.email, // list of receivers
          subject: 'CAMEL 아이디 등록 확인 절차', // Subject line
          text: '안녕하세요 CAMEL입니다.', // plaintext body
          html: "<br><b>"+param.user_name+"의 아이디 등록을 완료하기 위해서 아래 링크를 클릭해주세요. <br></b><br>"
          + "<a href=" +link.trim() + ">"+link+"</a>"
      };
      
      nodemail.sendMail(mailOptions, res, req);
      // 'ok' -> result : unit 테스트 코드 안에서 결과 값이 필요하기 때문에 수정함
      RestResponse.success(res, req.query.uuid, errorCode.OK, result);
      
//    checkPermission.set(permission, param, req);
//    userAuth.isAuthenticate(permission, function() {
//      userService.create(param, function(data, info){
//        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
//      }, function(code, message) {
//        RestResponse.failure(res, req.query.uuid, code, message);
//      });
//    }, function(code, message) {
//      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /users/truck 차주 등록 
   * @apiName createTruckUser
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_teller, broker_manager
   *
   * @apiParam {String} user_id 사용자 아이디(옵션)
   * @apiParam {String} user_name 사용자명 
   * @apiParam {String} phone 전화번호  
   * @apiParam {String} email 이메일(옵션)
   * @apiParam {String} password 사용자 비밀번호  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":"ok"
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
  router.post('/truck', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = req.body;
    
    var permission = {
        allow : ['broker_teller', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      userService.createTruckUser(param, function(data, info){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /users/:id 사용자 수정  
   * @apiName updateUser
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   *
   * @apiParam {String} user_id 사용자 아이디 
   * @apiParam {String} user_name 사용자명 
   * @apiParam {String} phone 전화번호  
   * @apiParam {String} email 이메일
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":"ok"
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
  router.put('/:id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    /*
     * 향후 화면과 같이 수정하도록 한다.
    if (check.undefined(req.body.user_id) || 
        check.undefined(req.body.user_name) || 
        check.undefined(req.body.password) ) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    */
    var param = req.body;
    param.user_id = req.params.id;
    // 이 api를 이용할 수 있는 권한 관리자, 운영자
    var permission = {
        allow : ['admin', 'operator'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      userService.update(param, function(data, info){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
    
    
  });
  
  /**
   * @api {delete} /users/:id 사용자 삭제   
   * @apiName updateUser
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   *
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":"ok"
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
   * TODO : 향후 불필요한 개인 정보는 지우는 기능이 들어가야 한다.
   */
  
  router.delete('/:id', function(req, res) {
    var param = {
        id : req.params.id
    }
    userService.delete(param, function(data){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {get} /users/:id/messages 사용자의 메시지 목록 조회    
   * @apiName listMessageForUser
   * @apiGroup user message
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator
   *
   * @apiSuccess {String} user_id 유저아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":41,"subject":"메시지 테스트 1","content":"오더 취소","status":"ACTIVE","created":"2015-07-12T14:06:29.000Z","creator":1},
   *   {"id":40,"subject":"메시지 테스트 2","content":"강제 배차","status":"ACTIVE","created":"2015-07-12T13:54:01.000Z","creator":1}
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
   * TODO : 향후 불필요한 개인 정보는 지우는 기능이 들어가야 한다.
   */  
  router.get('/:id/messages', function(req, res) {
    var limit = check.undefined(req.query.limit) ? '5' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        userId : req.params.id,
        limit : limit*1,
        page : page*1
    }
    messageService.listForReceiver(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
  /**
   * 사용자(차주) 사업자정보 등록
   * @api {post} /users/:user_id/business 사용자(차주) 사업자정보 등록
   * @apiName createBusiness 
   * @apiGroup broker users
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {Number} user_id 사용자 아이디
   * @apiParam {String} business_number 사업자번호
   * @apiParam {String} business_name 상호
   * @apiParam {String} owner_name 대표자명
   * @apiParam {String} business_condition 업태
   * @apiParam {String} business_type 업종
   * @apiParam {String} address_id 주소아이디
   * @apiParam {String} address_detail 주소상세
   * @apiParam {String} creator 생성자
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {code:0, contents:{
   *  fieldCount:0, affectedRows:1, insertId:0, serverStatus:3,
   *  warningCount:0,message:'',protocol41:true,changeRows:0}}
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   *
   * @apiSuccess {String} user_id 사용자 아이디 
   * 
   * @apiSuccessExample Success-Response : 아이디 중복인경우
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"user_id":user_id},
   * ]}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000, message: ["Query Error : ~~~~~~"]}
   * 
   */
  router.post('/:user_id/business', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = {
        user_id : req.params.user_id,
        business_number : req.body.business_number,
        business_name : req.body.business_name,
        owner_name : req.body.owner_name,
        business_condition : req.body.business_condition,
        business_type : req.body.business_type,
        address_id : req.body.address_id,
        address_detail : req.body.address_detail,
        creator : req.body.creator
    };
    var permission = {
        allow : ['broker_teller', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      userService.createBusiness(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 

  router.get('/:user_id/check', function(req, res) {
    console.log('req', req.params);
    var param = {
        userId : req.params.user_id,
    }
    userService.checkUserId(param, function(data) {
      
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /:id/checkActionKey/:key ActionKey 비교 
   * @apiName checkActionKey
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   *
   * @apiParam {int} id 사용자 아이디 
   * @apiParam {String} action_key 사용자 임시 키  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":"ok"
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
  router.get('/:id/checkActionKey/:key', function(req, res) {
    // /api/mails/checkActionKey 로 요청을 하면  
    // 주어진 actionKey로 유저를 검색해서 일치하는지 확인!
    // 일치하면 유저의 상태를 Active로 변경하고 actionKey삭제
    var param = {
        action_key : req.params.key,
        id : req.params.id
    }
    console.log(param);
    //id 로 유저를 검색해서 action_key를 확인한다. 확인 후 일치하면 status를 active로 
    //일치 하지 않으면 일치 하지 않는다는 메세지 출력! 
    userService.findOne(param, function(result) {
      if (param.action_key === result.action_key) {
        //status ACTIVE로 업데이트
        userService.updateStatus(result, function() {
          res.redirect('/#/dashboard');
        });
      } else {
        //실패 메시지 출력 
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * 사용자(차주) 사업자정보 등록
   * @api {post} /users/:user_id/business 사용자(차주) 사업자정보 등록
   * @apiName createBusiness 
   * @apiGroup broker users
   * 
   * @apiPermission broker_teller, broker_manager
   * 
   * @apiParam {Number} user_id 사용자 아이디
   * @apiParam {String} business_number 사업자번호
   * @apiParam {String} business_name 상호
   * @apiParam {String} owner_name 대표자명
   * @apiParam {String} business_condition 업태
   * @apiParam {String} business_type 업종
   * @apiParam {String} address_id 주소아이디
   * @apiParam {String} address_detail 주소상세
   * @apiParam {String} creator 생성자
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {code:0, contents:{
   *  fieldCount:0, affectedRows:1, insertId:0, serverStatus:3,
   *  warningCount:0,message:'',protocol41:true,changeRows:0}}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000, message: ["Query Error : ~~~~~~"]}
   * 
   */
  router.post('/:user_id/business', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = {
        user_id : req.params.user_id,
        business_number : req.body.business_number,
        business_name : req.body.business_name,
        owner_name : req.body.owner_name,
        business_condition : req.body.business_condition,
        business_type : req.body.business_type,
        address_id : req.body.address_id,
        address_detail : req.body.address_detail,
        creator : req.body.creator
    };
    var permission = {
        allow : ['broker_teller', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    };
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      userService.createBusiness(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
}
