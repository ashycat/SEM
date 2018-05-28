'use strict';

var userAuth = require('../../dao/userauth');
var errorCode = require('../../lib/errorCode');
var check = require('check-types');
var nodemail = require('../../lib/nodemailer');
var userService = require('../../services/userService');
var RestResponse = require('../../lib/RestResponse');

module.exports = function(router) {

  /**
   * @api {get} /mails/checkActionKey ActionKey 비교 
   * @apiName checkActionKey
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   *
   * @apiParam {int} id 사용자 아이디 
   * @apiParam {String} action_key 사용자 임시 키  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":"ok"
   * }
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
  router.get('/checkActionKey', function(req, res) {
    // /api/mails/checkActionKey 로 요청을 하면  
    // 주어진 actionKey로 유저를 검색해서 일치하는지 확인!
    // 일치하면 유저의 상태를 Active로 변경하고 actionKey삭제
    var param = {
        action_key : req.query.key,
        id : req.query.id
    }
    //id 로 유저를 검색해서 action_key를 확인한다. 확인 후 일치하면 status를 active로 
    //일치 하지 않으면 일치 하지 않는다는 메세지 출력! 
    userService.findOne(param, function(result) {
      if (param.action_key === result.action_key) {
        //status ACTIVE로 업데이트
        userService.updateStatus(result, function() {
          RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
        });
      } else {
        //실패 메시지 출력 
        RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
      }
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
    
  /**
   * @api {post} /mails/send 메일 송신  
   * @apiName sendMailForResetPassword
   * @apiGroup user
   * 
   * @apiVersion 0.1.0
   * 
   * @apiPermission all
   *
   * @apiParam {String} email 사용자 이메일  
   * 
   * @apiSuccessExample Success-Response :
   * HTTP/1.1 200 OK
   * { 
   *   "code":0,
   *   "contents":"ok"
   * }
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
  router.post('/send', function(req, res) {
    console.log('mailSend', req.body);
    var link = "http://localhost:8000/#!/common/resetPassword?id="+req.body.id+"&user_id="+req.body.user_id;
    var mailOptions = {
        from: 'suchang.jeong <suchang.jeong@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: '화물프로 아이디/비밀번호 찾기', // Subject line
        text: '아이디와 비번을 확인하기 위해 아래 링크를 클릭해주세요. ', // plaintext body
        html: "<a href="+link.trim()+">"+link.trim()+"</a><br>" 
    };
    nodemail.sendMail(mailOptions, res, req);
    RestResponse.success(res, req.query.uuid, errorCode.OK, 'ok');
  });
}
