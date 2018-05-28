'use strict';

var debug_param = require('debug')('param');
var debug_result = require('debug')('result');
var RestResponse = require('../../lib/RestResponse');
var brokerGroupService = require('../../services/brokerGroupService');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var logger = require('../../lib/logger');
var checkPermission = require('../../lib/checkPermission');
var userAuth = require('../../dao/userauth');

module.exports = function(router) {

  /**
   * @api {get} /brokergroups 주선소 그룹 목록 조회  
   * @apiName listBrokerGroups
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman
   * 
   * @apiParam {Number} limit 한페이지 개수
   * @apiParam {Number} page 페이지
   * 
   * @apiSuccess {String} id 주선소 그룹 아이디  
   * @apiSuccess {String} name 주선소 그룹    
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 변경자 아이디  
   * @apiSuccess {Date} modified 변경일시  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[{
   *  id: 1,
   *  name: "주선소 그룹1",
   *  creator: 1,
   *  created: "2015-06-14T08:17:11.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:08.000Z"
   *  },
   *  {
   *  id: 2,
   *  name: "주선소 그룹2",
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
    brokerGroupService.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /brokergrups/find 주선소 그룹 검색   
   * @apiName findBrokerGroups
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman
   * 
   * @apiParam {String} name 주선소 그룹명 (option) 
   * 
   * @apiSuccess {String} id 주선소 id  
   * @apiSuccess {String} name 주선소명  
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 변경자 아이디  
   * @apiSuccess {Date} modified 변경일시  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[{
   *  id: 1,
   *  name: "주선소 그룹1",
   *  creator: 1,
   *  created: "2015-06-14T08:17:11.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:08.000Z"
   *  },
   *  {
   *  id: 2,
   *  name: "주선소 그룹2",
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
    brokerGroupService.findAll(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   *  
   */
  /**
   * @api {get} /brokergroups/:id 개별 주선소 그룹 조회   
   * @apiName getBrokerGroup
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman
   * 
   * @apiSuccess {String} id 주선소 id  
   * @apiSuccess {String} name 주선소명  
   * @apiSuccess {Number} creator 생성자 아이디 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 변경자 아이디  
   * @apiSuccess {Date} modified 변경일시  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[{
   *  id: 1,
   *  name: "주선소 그룹1",
   *  creator: 1,
   *  created: "2015-06-14T08:17:11.000Z",
   *  modifier: 1,
   *  modified: "2015-06-27T07:55:08.000Z"
   *  },
   *  {
   *  id: 2,
   *  name: "주선소 그룹2",
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
  router.get('/:id', function(req, res) {
    var param = {
        id : req.params.id
    }
    brokerGroupService.findOne(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /brokergroups 주선소 그룹 등록   
   * @apiName createBrokerGroup
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman
   * 
   * @apiParam {String} id 주선소 그룹 아이디
   * @apiParam {String} name 주선소명
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
    
    if (check.undefined(req.body.name)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
      id : req.body.id.trim(),
      name : req.body.name.trim(),
      creator : req.body.creator.trim()
    }
    var permission = {
        allow : ['operator', 'admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerGroupService.create(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /brokergroups/:broker_group_id 주선소 그룹 수정  
   * @apiName updateBrokerGroup
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman, broker_manager 
   *
   * @apiParam {String} name 주선소명
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

    if (check.undefined(req.body.name)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
      name : req.body.name,
      id : req.params.id,
      modifier : req.body.modifier
    }
    
    var permission = {
        allow : ['operator', 'admin', 'salesman', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerGroupService.update(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * 주선소 그룹 삭제
   * TODO : 향후 불필요한 개인 정보는 지우는 기능이 들어가야 한다.
   * 
   * @api {delete} /brokergroups/:broker_group_id 주선소 그룹 삭제  
   * @apiName deleteBrokerGroup
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman, broker_manager
   * 
   * @apiParam {String} broker_group_id 주선소 그룹 아이디
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
  router.delete('/:broker_group_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    var param = {
        broker_group_id : req.params.broker_group_id
    }
    brokerGroupService.delete(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
  /**
   * @api {get} /brokergroups/:broker_group_id/members 주선소 그룹 맴버 조회  
   * @apiName listBrokerGroupMembers
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman, broker_manager
   * 
   * @apiParam {Number} limit 한페이지 표시 갯수
   * @apiParam {Number} page 페이지 번호
   * 
   * @apiSuccess {Number} broker_group_id 주선소 그룹 아이디
   * @apiSuccess {Number} broker_id 주선소 아이디
   * @apiSuccess {String} role 역할 ( MASTER | SLAVE )
   * @apiSuccess {Number} rate 수수표 %
   * @apiSuccess {String} name 주선소명
   * @apiSuccess {String} telephone 대표전화번호
   * @apiSuccess {String} handphone 대표휴대폰번호
   * @apiSuccess {String} address 주소 아이디
   * @apiSuccess {String} address_detail 주소 상세
   * @apiSuccess {String} post_code 우편번호
   * @apiSuccess {String} status 상태 ( ACTIVE )
   * @apiSuccess {Number} creator 생성자
   * @apiSuccess {String} created 생성일
   * @apiSuccess {String} modified 수정일
   * @apiSuccess {String} modifier 수정자
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {broker_group_id:189,broker_id:39,role:'SLAVE',rate:30,creator:1,created:'2015-08-18T01:36:19.000Z',id:39,name:'new broker', telephone:'123-1234-1234',handphone:'333-3333-3333',address:null,address_detail:null,post_code:null,status:'ACTIVE',modifier:1,modified:'2015-08-18T01:36:19.000Z',
   *   {broker_group_id:190,broker_id:39,role:'SLAVE',rate:30,creator:1,created:'2015-08-18T01:36:19.000Z',id:39,name:'new broker', telephone:'123-1234-1234',handphone:'333-3333-3333',address:null,address_detail:null,post_code:null,status:'ACTIVE',modifier:1,modified:'2015-08-18T01:36:19.000Z'
   * ]
   * ,info: { size: 2 } }}
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
  router.get('/:broker_group_id/members', function(req, res) {
    logger.debug("api req.params:", req.params);
    
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
      limit : limit*1,
      page : page*1,
      broker_group_id : req.params.broker_group_id
    };
    brokerGroupService.listMember(param, function(data, info){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 
  
  /**
   * 주선소 그룹 맴버 == 주선소
   * @api {post} /brokergroups/:id/members 주선소 그룹 맴버 추가  
   * @apiName addBrokerGroupMember 
   * @apiGroup broker group
   * 
   * @apiPermission admin, operator, salesman, broker_manager
   * 
   * @apiParam {Number} broker_id 주선소 아이디 
   * @apiParam {String} role 역할
   * @apiParam {Number} rate 수수표%
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
  router.post('/:broker_group_id/members', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    if (check.undefined(req.body.broker_id)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
      broker_group_id : req.params.broker_group_id,
      broker_id : req.body.broker_id,
      role : req.body.role,
      rate : req.body.rate,
      creator : req.body.creator
    };
    var permission = {
        allow : ['operator', 'admin', 'salesman', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerGroupService.addMember(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  }); 
  
  /**
   * @api {put} /brokergroups/:id/members/:broker_id 주선소 그룹 맴버 수정  
   * @apiName updateBrokerGroupMember 
   * @apiGroup broker group
   * 
   * @apiPermission admin, operator, salesman, broker_manager
   * 
   * @apiParam {String} role 역할
   * @apiParam {Number} rate 수수료율 
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":{
   *  fieldCount:0,affectedRows:1,insertId:0,serverStatus:3,warningCount:0,message:'',protocol41:true,changedRows:0}}
   * 
   * @apiError {String} code 에러코드 
   * @apiError {Object} message 에러 메시지
   * 
   * @apiErrorExample {json} Error-Response :
   * HTTP/1.1 200 OK
   * {code: 22000, message: ["Query Error : ~~~~~~"]}
   * 
   */
  router.put('/:broker_group_id/members/:broker_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    if (check.undefined(req.body.role) ||
        check.undefined(req.body.rate)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
      broker_group_id : req.params.broker_group_id,
      broker_id : req.params.broker_id,
      role : req.body.role,
      rate : req.body.rate
    };
    var permission = {
        allow : ['operator', 'admin', 'salesman', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerGroupService.updateMember(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /brokergroups/:broker_group_id/members/:broker_id 주선소 그룹 맴버 삭제 
   * @apiName deleteBrokerGroupMember
   * @apiGroup broker group
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, salesman, broker_manager
   * 
   * @apiParam {Number} broker_group_id 주선소 그룹 아이디
   * @apiParam {Number} broker_id 주선소 아이디
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
  router.delete('/:broker_group_id/members/:broker_id', function(req, res) {
    logger.debug("api req.params:", req.params);
    
    if (check.undefined(req.params.broker_group_id) || 
        check.undefined(req.params.broker_id)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
      broker_group_id : req.params.broker_group_id,
      broker_id : req.params.broker_id,
    };
    
    var permission = {
        allow : ['operator', 'admin', 'salesman', 'broker_manager'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      brokerGroupService.deleteMember(param, function(data){
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
}