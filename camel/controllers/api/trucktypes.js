'use strict';

var debug_param = require('debug')('param');
var debug_result = require('debug')('result');
var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var truckTypeService = require('../../services/truckTypeService');
var checkPermission = require('../../lib/checkPermission');

module.exports = function(router) {

  /**
   * @api {get} /trucktypes 차종 조회  
   * @apiName listTruckType
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {String} id 차량 종류 아이디   
   * @apiSuccess {String} name_kr 차량 종류 (한글) 
   * @apiSuccess {String} name_en 차량 종류 (영어)
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"name_kr":"카고","name_en":"cargo"},
   *   {"id":2,"name_kr":"탑차","name_en":"top"}
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
    console.log('testet', req.query);
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1
    }
    debug_param(req.query);
    debug_param(param);
    truckTypeService.listTruckType(param, function(data, info){
      debug_result('data is',data, info);
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });

    
    //    var permission = {
//        allow : ['admin'],
//        apiKey : req.query.apiKey.trim(),
//        secretKey : req.query.secretKey.trim(),
//        userId : req.cookies.id
//    }
//    checkPermission.set(permission, param, req);
//    userAuth.isAuthenticate(permission, function() {
//      truckTypeService.listTruckType(param, function(data){
//        console.log('datais',data );
//        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
//      }, function(code, message){
//        RestResponse.failure(res, req.query.uuid, code, message);
//      });
//    });
  });
  
  /**
   * @api {get} /trucktypes/:name_en/weights 차종별 중량 조회  
   * @apiName listWeightByTruckType
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} name_en 차종 영어명    
   * 
   * @apiSuccess {Number} id 아이디   
   * @apiSuccess {Number} weight 중량 (ton)  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"weight":1},
   *   {"id":2,"weight":2.5}
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
  router.get('/:name_en/weights', function(req, res) {
    truckTypeService.listWeightByTruckType(param, function(data){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /trucktypes 차종 등록 
   * @apiName createTruckType 
   * @apiGroup common
   * 
   * @apiPermission admin
   * 
   * @apiParam {String} name_kr 차종 한글명 
   * @apiParam {String} name_en 차종 영문명 
   * @apiParam {String} weight 중량  
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
    var param = {
        name_kr : req.body.name_kr,
        name_en : req.body.name_en,
        weight : req.body.weight
    }
    var permission = {
        allow : ['admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id,
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      truckTypeService.createTruckType(param, function(data) {
        RestResponse.success(res, req.query.uuid, errorCode.OK, data);
      }, function(code, message){
        RestResponse.failure(res, req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /trucktypes/:id 차종 삭제 
   * @apiName deleteTruckType
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin
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
        allow : ['admin'],
        apiKey : req.query.apiKey.trim(),
        secretKey : req.query.secretKey.trim(),
        userId : req.cookies.id
    }
    checkPermission.set(permission, param, req);
    userAuth.isAuthenticate(permission, function() {
      truckTypeService.deleteTruckType(param, function() {
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }, function(code, message){
        RestResponse.failure(req.query.uuid, code, message);
      });
    }, function(code, message) {
      RestResponse.failure(req.query.uuid, code, message);
    });
  });}