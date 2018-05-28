'use strict';

var RestResponse = require('../../lib/RestResponse');
var goodsCategoryDao = require('../../dao/goodsCategory');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');

module.exports = function(router) {

  /**
   * @api {get} /goodsCategories 상품 카테고리 조회  
   * @apiName listGoodsCategory
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {Number} id 상품 카테고리 아이디   
   * @apiSuccess {String} category 카테고리 
   * @apiSuccess {String} name 이름
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"category":"","name":""},
   *   {"id":2,"category":"","name":""}
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
  router.get('/', function(req, res) {
    console.log('goodsCategories list');
    
    goodsCategoryDao.list({}, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /goodsCategories/find 상품 카테고리 조회  
   * @apiName listGoodsCategoryByName
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {Number} id 상품 카테고리 아이디   
   * @apiSuccess {String} category 카테고리 
   * @apiSuccess {String} name 이름
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"category":"","name":""},
   *   {"id":2,"category":"","name":""}
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
  router.get('/find', function(req, res) {
    console.log(req.query, req.body);
    var param = {
        category : req.query.category,
        name : req.query.name
    }
    goodsCategoryDao.find(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /goodsCategories 상품 카테고리 등록 
   * @apiName createGoodsCategory 
   * @apiGroup common
   * 
   * @apiPermission admin
   * 
   * @apiSuccess {String} category 카테고리 
   * @apiSuccess {String} name 이름
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
    if (check.undefined(req.body.category) || 
        check.undefined(req.body.name) ) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        category : req.body.category,
        name : req.body.name
    }

    goodsCategoryDao.create(param, function(){
      RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /goodsCategories/:id 상품 카테고리 수정 
   * @apiName updateGoodsCategory
   * @apiGroup common
   * @apiVersion 0.1.0
   * 
   * @apiPermission broker, operator, admin
   * 
   * @apiParam {String} category 카테고리
   * @apiParam {String} name 이름
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
    if (check.undefined(req.body.category) || 
        check.undefined(req.body.name) ) {
      RestResponse.failure(res, null, errorCode.INVALID_PARAMETER, 'invalid request');
      return;
    }
    var param = {
        category : req.body.category,
        name : req.body.name,
        id : req.params.id
    }

    goodsCategoryDao.update(param, function(){
      RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
}