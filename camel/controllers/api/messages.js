/**
 * @since 2015/7
 */
'use strict';

var debug_param = require('debug')('param');
var debug_result = require('debug')('result');
var logger = require('../../lib/logger');
var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var messageService = require('../../services/messageService');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var checkPermission = require('../../lib/checkPermission');

module.exports = function(router) {

  /**
   * @api {get} /messages 메시지 목록 조회 
   * @apiName listMessages
   * @apiGroup message
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission user
   * 
   * @apiSuccess {Number} id 메시지 아이디 
   * @apiSuccess {String} subject 메시지 제목 
   * @apiSuccess {String} content 메시지 내용 
   * @apiSuccess {String} status 메시지 상태 (ACTIVE/DELETE)
   * @apiSuccess {Date} creator 생성자 
   * @apiSuccess {String} created 생성일시 
   * @apiSuccess {Date} modifier 변경자 
   * @apiSuccess {String} modified 변경일시
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
   *    "Query Error : ER_SP_UNDECLARED_VAR: Undeclared variable: NaN"
   *  ]}
   * 
   */
  router.get('/', function(req, res) {
    logger.debug('start /api/messages', req.query);
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1
    }
    debug_param(req.query);
    debug_param(param);
    messageService.list(param, function(data, info) {
      debug_result(data, info);
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info)
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {get} /messages/:id 메시지 조회 
   * @apiName getMesssage 
   * @apiGroup message
   * 
   * @apiVersion 0.1.0
   * 
   * @apiSuccess {Number} id 메시지 아이디 
   * @apiSuccess {String} subject 메시지 제목 
   * @apiSuccess {String} content 메시지 내용 
   * @apiSuccess {String} status 메시지 상태 (ACTIVE/DELETE)
   * @apiSuccess {String} creator 생성자 
   * @apiSuccess {String} created 생성일시 
   * @apiSuccess {String} modifier 변경자 
   * @apiSuccess {String} modified 변경일시
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,
   *  "contents":{
   *    "id":41,
   *    "subject":"메시지 제목 1",
   *    "content":"메시지 내용 1",
   *    "status":"ACTIVE",
   *    "created":"2015-07-12T14:06:29.000Z",
   *    "creator":1,
   *    "user_id":"user",
   *    "user_name":"사용자1",
   *    "role":"user"
   *  }
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
  router.get('/:id', function(req, res) {
    var param = {
        userId : req.cookies.id,
        id : req.params.id
    }
    messageService.findOne(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data)
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {post} /messages 메시지 생성 
   * @apiName createMessage 
   * @apiGroup message
   * 
   * @apiPermission broker, operator, admin
   * 
   * @apiParam {String} subject 제목
   * @apiParam {String} content 내용
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
  router.post('/', function(req, res) {
    if (check.undefined(req.query.apiKey) || 
        check.undefined(req.query.secretKey) ||
        check.undefined(req.body.subject) || 
        check.undefined(req.body.content)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        subject : req.body.subject.trim(),
        content : req.body.content.trim(),
        userId : req.cookies.id,
        receiverId : req.body.receiver_id
    }
    debug_param(param);
    
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      messageService.create(param, function(data) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message){
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });  

  /**
   * @api {put} /messages/:id 메시지 수정 
   * @apiName updateMessage
   * @apiGroup message
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, operator, admin
   * 
   * @apiParam {String} subject 제목
   * @apiParam {String} content 내용
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
    if (check.undefined(req.body.subject) || 
        check.undefined(req.body.content)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        subject : req.body.subject.trim(),
        content : req.body.content.trim(),
        userId : req.cookies.id,
        id : req.params.id
    }
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      messageService.update(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message){
        RestResponse.failure(req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /messages/:id 메시지 삭제 
   * @apiName deleteMessage
   * @apiGroup message
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, operator, admin
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
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      messageService.delete(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message){
        RestResponse.failure(req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /messages/:id/receivers 메시지의 수신자 목록 
   * @apiName getMessageReceiver
   * @apiGroup message receiver
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, operator, admin
   * 
   * @apiSuccess {Number} id receiver 아이디  
   * @apiSuccess {Number} message_id 메시지 아이디  
   * @apiSuccess {Number} receiver_id 수신자 아이디  
   * @apiSuccess {Boolean} send 송신 여부 
   * @apiSuccess {Boolean} is_read 읽음 여부 
   * @apiSuccess {String} created 생성일시 
   * @apiSuccess {String} user_name 사용자명 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,
   *  "contents":[{"id":16,
   *               "message_id":39,
   *               "receiver_id":1,
   *               "is_read":0,
   *               "send":0,
   *               "desc":null,
   *               "user_id":"user",
   *               "user_name":"tester",
   *               "role":"user"
   *             }]
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
  router.get('/:id/receivers', function(req, res) {
    var param = {
        id : req.params.id
    }
    messageService.listReceiver(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data)
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {post} /messages/:id/receivers 메시지 수신자 추가 
   * @apiName addMessageReceiver
   * @apiGroup message receiver
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, operator, admin
   * 
   * @apiParam {Numbrt} receiver_id 수신자 id
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
  router.post('/:id/receivers', function(req, res) {
    if (check.undefined(req.params.id) || 
        check.undefined(req.body.receiver_id)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        message_id : req.params.id,
        receiver_id : req.body.receiver_id
    }
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      messageService.addReceiver(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message){
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });  
}