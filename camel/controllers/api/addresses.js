'use strict';

var RestResponse = require('../../lib/RestResponse');
var userAuth = require('../../dao/userauth');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var addressService = require('../../services/addressService');
var logger = require('../../lib/logger')

module.exports = function(router) {

  /**
   * @api {get} /addresses/numbers 지번 우편번호 조회(검색) 
   * @apiName findNumberAddresses
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} location_name 읍면동  
   *   
   * @apiSuccess {Number} id 우편번호 id   
   * @apiSuccess {String} post_num 우편번호  
   * @apiSuccess {String} metro_name 시도  
   * @apiSuccess {String} city_name 시도  
   * @apiSuccess {String} location_name 읍면동
   * @apiSuccess {String} road_code 도로명코드
   * @apiSuccess {String} road_name 도로명 
   * @apiSuccess {String} building_num1 건물번호본번
   * @apiSuccess {String} building_num2 건물번호부번
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":11,"post_num":"11111","metro_name":"서울특별시","city_name":"강남구","location_name":"역삼1동"},
   *   {"id":21,"post_num":"11111","metro_name":"서울특별시","city_name":"강남구","location_name":"역삼2동"}
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
  router.get('/numbers', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1,
        location_name : req.query.location_name
    }

    addressService.listByLocationName(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /addresses/streets 도로명 우편번호 조회(검색) 
   * @apiName findStreetAddresses
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiParam {String} road_name 도로명 
   *   
   * @apiSuccess {Number} id 우편번호 id   
   * @apiSuccess {String} post_num 우편번호  
   * @apiSuccess {String} metro_name 시도  
   * @apiSuccess {String} city_name 시도  
   * @apiSuccess {String} location_name 읍면동  
   * @apiSuccess {String} building_num1 건물번호본번
   * @apiSuccess {String} building_num2 건물번호부번
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":11,"post_num":"11111","metro_name":"서울특별시","city_name":"강남구","location_name":"역삼1동"},
   *   {"id":21,"post_num":"11111","metro_name":"서울특별시","city_name":"강남구","location_name":"역삼2동"}
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
  router.get('/streets', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1,
        road_name : req.query.road_name
    }

    addressService.listByRoadName(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {get} /addresses/:id 주소 조회 
   * @apiName getAddresses
   * @apiGroup common
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {Number} id 우편번호 id   
   * @apiSuccess {String} post_num 우편번호  
   * @apiSuccess {String} metro_name 시도  
   * @apiSuccess {String} city_name 시도  
   * @apiSuccess {String} location_name 읍면동  
   * @apiSuccess {String} building_num1 건물번호본번
   * @apiSuccess {String} building_num2 건물번호부번
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"id":11,"post_num":"11111","metro_name":"서울특별시","city_name":"강남구","location_name":"역삼1동"}
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
  router.get('/:id', function(req, res) {
    logger.debug("api req.query:", req.query);
    logger.debug("api req.body:", req.body);
    logger.debug("api req.params:", req.params);
    
    var limit = check.undefined(req.query.limit) ? '10' : req.query.limit;
    var page = check.undefined(req.query.page) ? '0' : req.query.page;
    var param = {
        limit : limit*1,
        page : page*1,
        id : req.params.id
    }

    addressService.detail(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  

}