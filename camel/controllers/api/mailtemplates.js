'use strict';

var debug_param = require('debug')('param');
var debug_result = require('debug')('result');
var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var mailtemplateService = require('../../services/mailtemplateService');
module.exports = function(router) {

  /**
   * @api {get} /mailtemplates 이메일 템플릿 목록 조회   
   * @apiName listMailTemplates
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
   * 
   * @apiSuccess {Number} id 템플릿 id
   * @apiSuccess {String} subject 템플릿 제목   
   * @apiSuccess {String} content 템플릿 내용 
   * @apiSuccess {String} creator 생성자 id 
   * @apiSuccess {String} created 생성일시 
   * @apiSuccess {String} modifier 변경자 id 
   * @apiSuccess {String} modified 변경일시 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { code: 0,
   *   contents: [ 
   *     { id: 3,
   *        subject: 'test',
   *        content: 'test content',
   *        creator: 14,
   *        created: '2015-09-18T05:20:07.000Z',
   *        modifier: 14,
   *        modified: '2015-09-18T05:20:07.000Z' 
   *        }],
   *   info: { size: 1 } }
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
    debug_param(req.query);
    debug_param(param);
    mailtemplateService.list(param, function(data, info) {
      debug_result(data, info);
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /mailtemplates/:id 이메일 템플릿 목록 조회   
   * @apiName listMailTemplates
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
   * 
   * @apiSuccess {Number} id 템플릿 id
   * @apiSuccess {String} subject 템플릿 제목   
   * @apiSuccess {String} content 템플릿 내용 
   * @apiSuccess {String} creator 생성자 id 
   * @apiSuccess {String} created 생성일시 
   * @apiSuccess {String} modifier 변경자 id 
   * @apiSuccess {String} modified 변경일시 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { code: 0,
   *   contents: [ 
   *     { id: 3,
   *        subject: 'test',
   *        content: 'test content',
   *        creator: 14,
   *        created: '2015-09-18T05:20:07.000Z',
   *        modifier: 14,
   *        modified: '2015-09-18T05:20:07.000Z' 
   *        }],
   *   info: { size: 1 } }
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
    };
    debug_param(req.query);
    debug_param(param);
    mailtemplateService.one(param, function(data) {
      debug_result(data);
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /mailtemplates 이메일 템플릿 등록  
   * @apiName createMailTemplate
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
   * 
   * @apiParam {String} subject 템플릿 제목 
   * @apiParam {String} content 템플릿 내용 
   * @apiParam {Number} id 사용자 시스템 아이디 
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
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.post('/', function(req, res) {
    var param = {
        subject : req.body.subject,
        content : req.body.content,
        id : req.body.id
    };
    mailtemplateService.create(param, function(data){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
    
  });
  
  /**
   * @api {put} /mailtemplates/:id 이메일 템플릿 등록  
   * @apiName modifyMailTemplate
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
   * 
   * @apiParam {String} id 템플릿 시스템 아이디 
   * @apiParam {String} subject 템플릿 제목 
   * @apiParam {String} content 템플릿 내용 
   * @apiParam {String} userId 템플릿 수정자 시스템 아이디 
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
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.put('/:id', function(req, res) {
    var param = {
        id : req.params.id,
        subject : req.query.subject,
        content : req.query.content,
        userId : req.query.userId
    };
    mailtemplateService.updateMailtemplate(param, function(data){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
  /**
   * @api {delete} /mailtemplates/:id 이메일 템플릿 삭제  
   * @apiName deleteMailTemplate
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
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
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.delete('/:id', function(req, res) {
  });
  
  /**
   * @api {get} /mailtemplates/:template_id/rolegroups 이메일 템플릿 수신자 권한 그룹 조회 
   * @apiName listRoleGroupForMailTemplates
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
   * 
   * @apiSuccess {String} rolegroup_id 수신자 그룹 id   
   * @apiSuccess {String} rolegroup_name 수신자 그룹명  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"name":"회원가입 메일 수신 그룹","creator":1,"created":"2015-08-10T10:10:00.000Z"},
   *   {"id":1,"name":"비밀번호변경 메일 수신 그룹","creator":1,"created":"2015-08-10T10:10:00.000Z"}
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
  router.get('/:template_id/rolegroups', function(req, res) {
    var param = {
        template_id : req.params.template_id
    };
    mailtemplateService.listForReceiver(param, function(data) {
      debug_result(data);
      RestResponse.success(res, req.query.uuid, errorCode.OK, data)
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /mailtemplates/:template_id/rolegroups 이메일 템플릿 수신자 권한 그룹 등록  
   * @apiName createRoleGroupForMailTemplate
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
   * 
   * @apiParam {Number} id rolegroup id 
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
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.post('/:template_id/rolegroups', function(req, res) {
    if (check.undefined(req.body.receiverGroups)) {
      var param = {
          template_id : req.params.template_id
      };
    } else {
      var param = {
          template_id : req.params.template_id,
          receiverGroup : req.body.receiverGroups
      };
    }
    mailtemplateService.updateReceiverGroup (param, function(data) {
      debug_result(data);
      RestResponse.success(res, req.query.uuid, errorCode.OK, data)
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /mailtemplates/:template_id/rolegroups/:group_id 이메일 템플릿 수신자 권한 그룹 삭제   
   * @apiName deleteRoleGroupForMailTemplate
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
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
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.delete('/:template_id/rolegroups/:group_id', function(req, res) {
  });

  /**
   * @api {post} /mailtemplates/:template_id/test 이메일 템플릿에 대한 송신 테스트   
   * @apiName sendTestMailTemplate
   * @apiGroup email template
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission operator, salesman, admin
   * 
   * @apiParam {String} email 송신 테스트용 이메일  
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
   *    "Query Error : ~~~"
   *  ]}
   * 
   */  
  router.post('/:template_id/test', function(req, res) {
  });
  
}