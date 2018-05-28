'use strict';

//var db = require('../../lib/database');
var genericPool = require('../../lib/generic-pool');
var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var noticeDao = require('../../dao/notice');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');

module.exports = function(router) {

  /**
   * @api {get} /notices 공지사항 목록 조회 
   * @apiName listNotices
   * @apiGroup notice
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {Number} id 공지사항 아이디 
   * @apiSuccess {String} subject 공지사항 제목 
   * @apiSuccess {String} content 공지사항 내용 
   * @apiSuccess {String} status 공지사항 상태 (ACTIVE/DELETE)
   * @apiSuccess {Date} creator 생성자 
   * @apiSuccess {String} created 생성일시 
   * @apiSuccess {Date} modifier 변경자 
   * @apiSuccess {String} modified 변경일시
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"subject":"공지사항 테스트 1","content":"공지사항 내용1","status":"ACTIVE","created":"2015-07-12T14:06:29.000Z","creator":1},
   *   {"id":2,"subject":"공지사항 테스트 2","content":"공지사항 내용2","status":"ACTIVE","created":"2015-07-12T13:54:01.000Z","creator":1}
   * ]}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000,
   *  message: [
   *    "Query Error : ~~~~"
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
    noticeDao.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {get} /notices/:id 개별 공지사항 조회 
   * @apiName getNotice 
   * @apiGroup notice
   * 
   * @apiVersion 0.1.0
   * 
   * @apiSuccess {Number} id 공지사항 아이디 
   * @apiSuccess {String} subject 공지사항 제목 
   * @apiSuccess {String} content 공지사항 내용 
   * @apiSuccess {String} status 공지사항 상태 (ACTIVE/DELETE)
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
   *    "subject":"공지사항 제목 1",
   *    "content":"공지사항 내용 1",
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
        id : req.params.id
    }
    noticeDao.one(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   *  
   */
  /**
   * @api {post} /notices 공지사항 등록 
   * @apiName createNotice 
   * @apiGroup notice
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
    if (check.undefined(req.body.subject) || 
        check.undefined(req.body.content)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    console.log('req.body : ', req.body);
//    var param = {
//        subject : req.body.subject.trim(),
//        content : req.body.content.trim(),
//        fileNames : req.body.fileName,
//        userId : req.cookies.id
//    }
    var param = req.body;
    param.userId = req.cookies.id;
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    userAuth.isAuthenticate(permission, function() {
      noticeDao.create(param, function() {
        RestResponse.success(res, null, 0, 'ok');
      }, function(code, message){
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
   * @api {put} /notices/:id 공지사항 수정 
   * @apiName updateNotice
   * @apiGroup notice
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
        id : req.params.id,
    }
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    userAuth.isAuthenticate(permission, function() {
      noticeDao.update(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message){
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });

  });
  
  /**
   * @api {delete} /notices/:id 공지사항 삭제 
   * @apiName deleteNotice
   * @apiGroup notice
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
    userAuth.isAuthenticate(permission, function() {
      noticeDao.delete(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message){
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
}