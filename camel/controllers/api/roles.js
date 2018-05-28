/**
 * New node file
 */
'user strict'

var RestResponse = require('../../lib/RestResponse');
var errorCode = require('../../lib/errorCode');
var userAuth = require('../../dao/userauth');
var check = require('check-types');
var roleDao = require('../../dao/role');

module.exports = function(router) {
  /**
   * @api {get} /roles 롤 목록 조회  
   * @apiName getRoles
   * @apiGroup role
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission admin
   *
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * {
   *     "code": 0,
   *     "contents": [
   *         {
   *             "id": 1,
   *             "name": "broker"
   *         },
   *         {
   *             "id": 2,
   *             "name": "operator"
   *         },
   *         {
   *             "id": 3,
   *             "name": "admin"
   *         }
   *     ],
   *     "info": {
   *         size: 3
   *     }
   * } 
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
    var param = {};
    roleDao.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
};