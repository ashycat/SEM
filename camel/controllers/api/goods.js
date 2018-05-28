'use strict';

var RestResponse = require('../../lib/RestResponse');
var goodsDao = require('../../dao/goods');
var messageDao = require('../../dao/message');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');

module.exports = function(router) {

  /**
   * @api {get} /goods 화주 목록조회
   * @apiName list
   * @apiGroup goods
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {Number} limit 페이지 제한
   * @apiParam {Number} page 페이지
   * 
   * 
   * @apiSuccess {Number} id 화물 아이디 
   * @apiSuccess {Number} weight 무게(ton)
   * @apiSuccess {Number} length 길이(m) 
   * @apiSuccess {Number} is_mix 단일 품목 화물 (0)/ 혼합 화물(1) 
   * @apiSuccess {Number} goods_category_id 화물 품목 아이디 
   * @apiSuccess {String} sender_name 화주 이름
   * @apiSuccess {String} sender_telephone 화주 대표번호 
   * @apiSuccess {String} sender_handphone 화주 핸드폰번호 
   * @apiSuccess {String} sendee_name  화물 받는 사람 
   * @apiSuccess {String} sendee_telephone 화물 받는 사람 전화번호 
   * @apiSuccess {String} sendee_handphone 화물 받는 사람 햄드폰
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
        limit : limit*1,
        page : page*1
    }
    goodsDao.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /goods/find 화주 검색
   * @apiName find
   * @apiGroup goods
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {Number} weight 무게(ton)
   * @apiParam {Number} length 길이(m)
   * @apiParam {Number} isMix 단일 품목 화물 (0)/ 혼합 화물(1)
   * @apiParam {Number} goodsCategoryId 화물 품목 아이디
   * @apiParam {String} senderName 화주 이름
   * @apiParam {String} senderTelephone 화주 대표번호
   * @apiParam {String} senderHandphone 화주 핸드폰번호
   * @apiParam {String} sendeeName 화물받는사람
   * @apiParam {String} sendeeTelephone 화물받는사람 대표번호
   * @apiParam {String} sendeeHandphone 화물받는 사람 핸드폰
   *
   * 
   * @apiSuccess {Number} id 화물 아이디 
   * @apiSuccess {Number} weight 무게(ton)
   * @apiSuccess {Number} length 길이(m) 
   * @apiSuccess {Number} is_mix 단일 품목 화물 (0)/ 혼합 화물(1) 
   * @apiSuccess {Number} goods_category_id 화물 품목 아이디 
   * @apiSuccess {String} sender_name 화주 이름
   * @apiSuccess {String} sender_telephone 화주 대표번호 
   * @apiSuccess {String} sender_handphone 화주 핸드폰번호 
   * @apiSuccess {String} sendee_name  화물 받는 사람 
   * @apiSuccess {String} sendee_telephone 화물 받는 사람 전화번호 
   * @apiSuccess {String} sendee_handphone 화물 받는 사람 햄드폰
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
    var param = {
        weight : req.query.weight*1.0,
        length : req.query.length*1.0,
        isMix : req.query.isMix,
        goodsCategoryId : req.query.goodsCategoryId,
        senderName : req.query.senderName,
        senderTelephone : req.query.senderTelephone,
        senderHandphone : req.query.senderHandphone,
        sendeeName : req.query.sendeeName,
        sendeeTelephone : req.query.sendeeTelephone,
        sendeeHandphone : req.query.sendeeHandphone
    }
    
    goodsDao.find(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /goods/:id 화물 개별 검색
   * @apiName one
   * @apiGroup goods
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {Number} type 단일 품목 화물 (0)/ 혼합 화물(1)
   * @apiParam {Number} id 화물 아이디
   *
   * 
   * @apiSuccess {Number} id 화물 아이디 
   * @apiSuccess {Number} weight 무게(ton)
   * @apiSuccess {Number} length 길이(m) 
   * @apiSuccess {Number} is_mix 단일 품목 화물 (0)/ 혼합 화물(1) 
   * @apiSuccess {Number} goods_category_id 화물 품목 아이디 
   * @apiSuccess {String} sender_name 화주 이름
   * @apiSuccess {String} sender_telephone 화주 대표번호 
   * @apiSuccess {String} sender_handphone 화주 핸드폰번호 
   * @apiSuccess {String} sendee_name  화물 받는 사람 
   * @apiSuccess {String} sendee_telephone 화물 받는 사람 전화번호 
   * @apiSuccess {String} sendee_handphone 화물 받는 사람 햄드폰
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
        id : req.params.id,
        type : req.query.type
    }
    goodsDao.one(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /goods  화물 등록
   * @apiName create
   * @apiGroup goods
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, broker
   * 
   * @apiParam {Number} weight 무게(ton)
   * @apiParam {Number} length 길이(m) 
   * @apiParam {Number} is_mix 단일 품목 화물 (0)/ 혼합 화물(1) 
   * @apiParam {Number} goods_category_id 화물 품목 아이디 
   * @apiParam {String} sender_name 화주 이름
   * @apiParam {String} sender_telephone 화주 대표번호 
   * @apiParam {String} sender_handphone 화주 핸드폰번호 
   * @apiParam {String} sendee_name  화물 받는 사람 
   * @apiParam {String} sendee_telephone 화물 받는 사람 전화번호 
   * @apiParam {String} sendee_handphone 화물 받는 사람 햄드폰
   * @apiParam {Number} userId 사용자 아이디 
   * 
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
    if (check.undefined(req.body.weight) || 
        check.undefined(req.body.length) ||
        check.undefined(req.body.isMix) ||
        check.undefined(req.body.goodsCategoryId) ||
        check.undefined(req.body.senderName) ||
        check.undefined(req.body.senderTelephone) ||
        check.undefined(req.body.senderHandphone) ||
        check.undefined(req.body.sendeeName) ||
        check.undefined(req.body.sendeeTelephone) ||
        check.undefined(req.body.sendeeHandphone)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        weight : req.body.weight*1.0,
        length : req.body.length*1.0,
        isMix : req.body.isMix,
        goodsCategoryId : req.body.goodsCategoryId,
        description : req.body.description,
        senderName : req.body.senderName,
        senderTelephone : req.body.senderTelephone,
        senderHandphone : req.body.senderHandphone,
        sendeeName : req.body.sendeeName,
        sendeeTelephone : req.body.sendeeTelephone,
        sendeeHandphone : req.body.sendeeHandphone,
        userId : req.cookies.id,
    }
    // 이 api를 이용할 수 있는 권한 관리자, 운영자, 주선소
    var permission = {
        allow : ['admin', 'operator', 'broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    userAuth.isAuthenticate(permission, function() {
      goodsDao.create(param, function(){
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /goods/:id  화물 수정
   * @apiName update
   * @apiGroup goods
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, broker
   * 
   * @apiParam {Number} id 화물 아이디 
   * @apiParam {Number} weight 무게(ton)
   * @apiParam {Number} length 길이(m) 
   * @apiParam {Number} is_mix 단일 품목 화물 (0)/ 혼합 화물(1) 
   * @apiParam {Number} goods_category_id 화물 품목 아이디 
   * @apiParam {String} sender_name 화주 이름
   * @apiParam {String} sender_telephone 화주 대표번호 
   * @apiParam {String} sender_handphone 화주 핸드폰번호 
   * @apiParam {String} sendee_name  화물 받는 사람 
   * @apiParam {String} sendee_telephone 화물 받는 사람 전화번호 
   * @apiParam {String} sendee_handphone 화물 받는 사람 햄드폰
   * @apiParam {Number} userId 사용자 아이디 
   * 
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
    if (check.undefined(req.body.weight) || 
        check.undefined(req.body.length) ||
        check.undefined(req.body.isMix) ||
        check.undefined(req.body.goodsCategoryId) ||
        check.undefined(req.body.senderName) ||
        check.undefined(req.body.senderTelephone) ||
        check.undefined(req.body.senderHandphone) ||
        check.undefined(req.body.sendeeName) ||
        check.undefined(req.body.sendeeTelephone) ||
        check.undefined(req.body.sendeeHandphone)) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }

    var param = {
        weight : req.body.weight*1.0,
        length : req.body.length*1.0,
        isMix : req.body.isMix,
        goodsCategoryId : req.body.goodsCategoryId,
        description : req.body.description,
        senderName : req.body.senderName,
        senderTelephone : req.body.senderTelephone,
        senderHandphone : req.body.senderHandphone,
        sendeeName : req.body.sendeeName,
        sendeeTelephone : req.body.sendeeTelephone,
        sendeeHandphone : req.body.sendeeHandphone,
        userId : req.cookies.id,
        id : req.params.id
    }
    
    // 이 api를 이용할 수 있는 권한 관리자, 운영자, 주선소
    var permission = {
        allow : ['admin', 'operator', 'broker'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    userAuth.isAuthenticate(permission, function() {
      goodsDao.update(param, function(){
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message) {
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * 상품 삭제 (status를 'DELETE'로 변경)
   * TODO : 향후 불필요한 개인 정보는 지우는 기능이 들어가야 한다.
   */
  /**
   * @api {delete} /goods/:id  화물 수정
   * @apiName delete
   * @apiGroup goods
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin, operator, broker
   * 
   * @apiParam {Number} id 화물 아이디 
   * 
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
        id : req.params.id
    }
    goodsDao.delete(param, function() {
      RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

}