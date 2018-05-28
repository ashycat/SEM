'use strict';

var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var locationDao = require('../../dao/location');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');

module.exports = function(router) {

  /**
   * @api {get} /locations/metros 광역시도 조회  
   * @apiName listMetro
   * @apiGroup location
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {Number} id 광역시도 아이디   
   * @apiSuccess {String} name 광역시도 이름
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"name":"서울특별시"},
   *   {"id":2,"name":"부산광역시"}
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
  router.get('/metros', function(req, res) {
    locationDao.metroList({}, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /locations/metros/:id/cities 광역시도의 시군구 조회  
   * @apiName listMetrosCity
   * @apiGroup location
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} metro_id 광역시도 아이디
   * 
   * @apiSuccess {Number} id 아이디   
   * @apiSuccess {Number} metro_id 광역시도 아이디 
   * @apiSuccess {String} name1 시군구 이름1 
   * @apiSuccess {String} name2 시군구 이름2
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"metro_id":1,"name1":"","name2":"종로구"},
   *   {"id":2,"metro_id":1,"name1":"","name2":"중구"}
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
  router.get('/metros/:id/cities', function(req, res) {
    var param = {
        id : req.params.id
    }
    locationDao.cityList(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /locations/cities/:id/units 광역시도의 시군구의 읍면동 조회
   * @apiName listCytiesUnit
   * @apiGroup location
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} city_id 광역시도의 시군구의 아이디
   * 
   * @apiSuccess {Number} id 아이디   
   * @apiSuccess {Number} city_id 광역시도의 시군구의 아이디
   * @apiSuccess {String} name 읍면동 이름
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"city_id":1,"name":"청운효자동"},
   *   {"id":2,"city_id":1,"name":"사직동"}
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
  router.get('/cities/:id/units', function(req, res) {
    var param = {
        id : req.params.id,
    }
    locationDao.unitList(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /locations/find 지역명 검색
   * @apiName findLocation
   * @apiGroup location
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} name 시군구 or 동읍면 이름
   * 
   * @apiSuccess {Number} id 상품 카테고리 아이디   
   * @apiSuccess {String} metro_name 광역시도 이름 
   * @apiSuccess {String} name1 시군구 이름1 
   * @apiSuccess {String} name2 시군구 이름2
   * @apiSuccess {String} name 동읍면 이름
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":1,"metro_name":"서울특별시","name1":"","name2":"종로구","name":"청운효자동"},
   *   {"id":2,"metro_name":"서울특별시","name1":"","name2":"종로구","name":"사직"}
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
    var param = {
        name : req.query.name
    }
    locationDao.find(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
}