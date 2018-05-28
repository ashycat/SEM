'use strict';

var RestResponse = require('../../lib/RestResponse');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var consignerService = require('../../services/consignerService');
var userAuth = require('../../dao/userauth');
var checkPermission = require('../../lib/checkPermission');
var logger = require('../../lib/logger');

module.exports = function(router) {

  /**
   * @api {get} /consigners/ 화주 목록조회
   * @apiName list
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {Number} brokerId 브로커 아이디
   * @apiParam {String} type 
   * @apiParam {Number} limit 페이지 제한
   * @apiParam {Number} page 페이지
   * @apiParam {Number} userId 사용자 아이디
   * 
   * 
   * @apiSuccess {Number} id 화주(거래처) 아이디 
   * @apiSuccess {String} name 거래처명 
   * @apiSuccess {String} phone 대표전화번호 
   * @apiSuccess {String} fax FAX번호
   * @apiSuccess {Number} broker_id 주선소 ID 
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} creator 생성자 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 수정자 
   * @apiSuccess {Date} modified 수정일시 
   *
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
        userId : req.cookies.id,
    }
    if (!check.undefined(req.query.brokerId)) {
      param.brokerId = req.query.brokerId*1; 
    }
    
    consignerService.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /consigners/find  화주 검색
   * @apiName find
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {Number} brokerId 브로커 아이디
   * @apiParam {String} name 거래처명 
   * @apiParam {Number} limit 페이지 제한
   * @apiParam {Number} page 페이지
   * @apiParam {Number} userId 사용자 아이디
   * 
   * 
   * @apiSuccess {Number} id 화주(거래처) 아이디 
   * @apiSuccess {String} name 거래처명 
   * @apiSuccess {String} phone 대표전화번호 
   * @apiSuccess {String} fax FAX번호
   * @apiSuccess {Number} broker_id 주선소 ID 
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} creator 생성자 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 수정자 
   * @apiSuccess {Date} modified 수정일시 
   *
   *
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": [{
   *  
   * }],
   *}
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
        brokerId : req.query.brokerId,
        userId : req.cookies.id,
        name : req.query.name,
        limit : limit*1,
        page : page*1
    }
    consignerService.find(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {get} /consigners/:id  화주 개별 검색
   * @apiName findOne
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {Number} Id 화주 아이디
   * 
   * 
   * @apiSuccess {Number} id 화주(거래처) 아이디 
   * @apiSuccess {String} name 거래처명 
   * @apiSuccess {String} phone 대표전화번호 
   * @apiSuccess {String} fax FAX번호
   * @apiSuccess {Number} broker_id 주선소 ID 
   * @apiSuccess {String} status 상태
   * @apiSuccess {Number} creator 생성자 
   * @apiSuccess {Date} created 생성일시 
   * @apiSuccess {Number} modifier 수정자 
   * @apiSuccess {Date} modified 수정일시 
   *
   *
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": [{
   *  
   * }],
   *}
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
    consignerService.findOne(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {post} /consigners  화주 정보 등록
   * @apiName createConsigner
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} name 거래처명
   * @apiParam {String} phone 대표전화번호
   * @apiParam {String} fax FAX번호
   * @apiParam {Number} broker_id 주선소 아이디
   * @apiParam {Number} creator 생성자
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": "ok",
   *}
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
    var param = req.body;
    param.userId = req.cookies.id;
    var permission = {
        allow : ['broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      consignerService.createConsigner(param, function(data, info) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /consigners/:id  화주 정보 수정
   * @apiName update
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {Number} name 거래처명
   * @apiParam {String} phone 대표전화번호
   * @apiParam {String} fax FAX번호
   * @apiParam {Number} id 사용자 아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": "ok",
   *}
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
    console.log('param', req.params.id);
    console.log('query', req.query);
    var param = {
        id : req.params.id,
        name : req.body.name,
        phone : req.body.phone,
        fax : req.body.fax
    }
    var permission = {
        allow : ['broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      consignerService.update(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
   
  /**
   * @api {delete} /consigners/:id  화주 정보 삭제
   * @apiName deleteConsigner
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {Number} consigner_id 화주 아이디
   * @apiParam {Number} id 사용자 아이디
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   * "code": 0,
   * "contents": "ok",
   *}
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
        id : req.params.id,
        consigner_id : req.params.id
    }
    var permission = {
        allow : ['broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      consignerService.deleteConsigner(param, function(data) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  
  /**
   * @api {delete} /consigners/:consigner_id/members/:member_id 주선소에 속한 담당자 삭제
   * @apiName deleteConsignerMember
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} member_id 멤버 아이디
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
  router.delete('/:consigner_id/members/:member_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.params:", req.params);
    var param = {
        consigner_id : req.params.consigner_id,
        member_id : req.params.member_id
    }
    consignerService.deleteConsignerMember(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      logger.debug("api error:", code, message);
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
  /**
   * @api {post} /consigners/:consigner_id/members 담당자 등록
   * @apiName createConsignerMember
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} consigner_id 고객 아이디
   * @apiParam {String} member_name 담당자명
   * @apiParam {String} member_telephone 전화번호
   * @apiParam {String} member_handphone 휴대전화번호
   * @apiParam {String} member_email 이메일
   * @apiParam {String} member_description 메모
   * @apiParam {String} creator 생성자
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
  router.post('/:consigner_id/members', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = req.body;
    param.consigner_id = req.params.consigner_id;
    
    consignerService.createConsignerMember(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      logger.debug("api error:", code, message);
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /consigners/:consigner_id/members/:member_id 담당자 수정
   * @apiName updateConsignerMember
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} id 담당자 아이디
   * @apiParam {String} member_name 담당자명
   * @apiParam {String} member_telephone 전화번호
   * @apiParam {String} member_handphone 휴대전화번호
   * @apiParam {String} member_email 이메일
   * @apiParam {String} member_description 메모
   * @apiParam {String} modifier 생성자
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
  router.put('/:consigner_id/members/:member_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = req.body;
    param.id = req.params.member_id;
    
    consignerService.updateConsignerMember(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      logger.debug("api error:", code, message);
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  
  /**
   * @api {post} /consigners/:consigner_id/business 사업자 정보 등록
   * @apiName createConsignerBusiness
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} consigner_id 고객 아이디
   * @apiParam {String} business_ceo_nam 대표자명
   * @apiParam {String} business_name 상호명
   * @apiParam {String} business_condition 업태
   * @apiParam {String} business_type 업종
   * @apiParam {String} business_address_id 주소 id
   * @apiParam {String} business_address_detail 주소상세
   * @apiParam {String} creator 생성자
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
  router.post('/:consigner_id/business', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = req.body;
    param.consigner_id = req.params.consigner_id;
    
    consignerService.createConsignerBusiness(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      logger.debug("api error:", code, message);
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /consigners/:consigner_id/business/:business_id 사업자 정보 수정
   * @apiName updateConsignerBusiness
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} id 사업자 정보 아아디
   * @apiParam {String} business_ceo_nam 대표자명
   * @apiParam {String} business_name 상호명
   * @apiParam {String} business_condition 업태
   * @apiParam {String} business_type 업종
   * @apiParam {String} business_address_id 주소 id
   * @apiParam {String} business_address_detail 주소상세
   * @apiParam {String} modifier 수정자
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
  router.put('/:consigner_id/business/:business_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = req.body;
    param.id = req.params.business_id;
    
    consignerService.updateConsignerBusiness(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      logger.debug("api error:", code, message);
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /consigners/:consigner_id/business/:business_id 사업자 정보 삭제
   * @apiName deleteConsignerBusiness
   * @apiGroup consigner
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker_manager
   * 
   * @apiParam {String} id 사업자 정보 아아디
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
  router.delete('/:consigner_id/business/:business_id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var param = req.body;
    param.id = req.params.business_id;
    param.consigner_id = req.params.consigner_id;
    
    consignerService.deleteConsignerBusiness(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
}