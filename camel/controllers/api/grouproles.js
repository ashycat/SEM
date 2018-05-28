/**
 * New node file
 */
'user strict'

var RestResponse = require('../../lib/RestResponse');
var grouproleDao = require('../../dao/grouprole');
var errorCode = require('../../lib/errorCode');
var userAuth = require('../../dao/userauth');
var check = require('check-types');

module.exports = function(router) {
  
  /**
   * @api {get} /grouproles/:id 그룹 롤 조회  
   * @apiName listTruckType
   * @apiGroup role
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   * 
   * @apiSuccess {String} name 롤 이름
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {"code":0,"contents":[
   *   {"name":"admin"},
   *   {"name":"user"}
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
    var param = {
        groupId : req.params.id
    };
    grouproleDao.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
};