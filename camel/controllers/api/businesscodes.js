'use strict';

var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var businessCodesService = require('../../services/businessCodesService')

module.exports = function(router) {

  /**
   * @api {get} /businesscodes/condition 업태 조회(검색) 
   * @apiName findBusinessCode
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} name 업태입력  
   *   
   * @apiSuccess {String} id 업태코드 (2자리)  
   * @apiSuccess {String} name_kr 업종명(한글) 
   * @apiSuccess {String} name_en 업종명(영어)  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":"03","name_kr":"어업","name_en":"Fishing"},
   *   {"id":"031","name_kr":"어로 어업","name_en":"Fishing and Gathering of Marine Materials"}
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
  router.get('/condition', function(req, res) {
    var param = {
        name : req.query.name
    };
    businessCodesService.findBusinessCondition(param, function(data){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /businesscodes/type 업종 조회(검색) 
   * @apiName findBusinessCode
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} name 업종입력  
   *   
   * @apiSuccess {String} id 업종코드 (5자리)  
   * @apiSuccess {String} name_kr 업종명(한글) 
   * @apiSuccess {String} name_en 업종명(영어)  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":"03","name_kr":"어업","name_en":"Fishing"},
   *   {"id":"031","name_kr":"어로 어업","name_en":"Fishing and Gathering of Marine Materials"}
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
  router.get('/type', function(req, res) {
    var param = {
        name : req.query.name
    };
    businessCodesService.findBusinessType(param, function(data){
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
}