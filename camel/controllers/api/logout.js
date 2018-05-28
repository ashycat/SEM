'use strict';

var passport = require('passport');
var RestResponse = require('../../lib/RestResponse');
var errorCode = require('../../lib/errorCode');

module.exports = function(router) {

  /**
   * @api {get} /logout 로그아웃 
   * @apiName logout
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
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
   * 
   */
  router.get('/', function(req, res) {
    req.logout();
    res.clearCookie('apiKey');
    res.clearCookie('secretKey');
    res.clearCookie('id');
    res.clearCookie('userId');
    res.clearCookie('userName');
    res.clearCookie('role');
    res.clearCookie('trucks');
    req.session.id = null;
    req.session.apiKey = null;
    req.session.secretKey = null;
    RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
  });

};
