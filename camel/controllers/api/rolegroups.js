/**
 * New node file
 */
'user strict';

var RestResponse = require('../../lib/RestResponse');
var rolegroupDao = require('../../dao/rolegroup');
var errorCode = require('../../lib/errorCode');
var userAuth = require('../../dao/userauth');
var check = require('check-types');
var rolegroupService = require('../../services/rolegroupService');

module.exports = function(router) {

  /**
   * @api {get} /rolegroups 롤 그룹 목록 조회  
   * @apiName getRolegroups
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
   *             "name": "주선소"
   *         },
   *         {
   *             "id": 2,
   *             "name": "관리자"
   *         }
   *     ],
   *     "info": {
   *         size: 2
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
    console.log('get Role Group List');
    var param = {};
    rolegroupDao.list(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {post} /rolegroups 롤 그룹 생성   
   * @apiName createRolegroups
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
   *     "contents": "ok"
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
  
  router.post('/', function(req, res) {
    console.log("req.body",req.body);
    var param = {
        roleGroupName : req.body.name 
    };
    rolegroupDao.create(param, function() {
      RestResponse.success(res, req.query.uuid, errorCode.OK);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  /**
   * @api {get} /rolegroups/:id/users 롤 그룹 맴버 목록 조회   
   * @apiName getMemberForRolegroups
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
   *             "user_id": "user",
   *             "user_name": "tester",
   *             "telephone": "07011111111",
   *             "handphone": "01011111111",
   *             "role": "user",
   *             "status": "ACTIVE"
   *         },
   *         {
   *             "id": 10,
   *             "user_id": "tester",
   *             "user_name": "tester2",
   *             "telephone": null,
   *             "handphone": null,
   *             "role": "user",
   *             "status": "ACTIVE"
   *         }
   *     ],
   *     "info": {
   *         "size": 2,
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
  router.get('/:id/users', function(req, res) {
    console.log("rolegroupuserslist", req.params.id);
    var param = req.params;
    rolegroupDao.listForRoleGroupUser(param, function(data, info) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data, info);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {delete} /rolegroups/:id/users/:userId 롤 그룹 맴버 삭제    
   * @apiName deleteMemberForRolegroups
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
   *     "contents": "ok"
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
  router.delete('/:id/users/:userid', function(req, res) {
    var param = {
        id : req.params.id,
        userid : req.params.userid
    };
    rolegroupDao.deleteForRoleGroupUser(param, function() {
      RestResponse.success(res, req.query.uuid, errorCode.OK);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * TODO : 제대로 기능되는게 맞는지 확인 필요 
   */
  router.put('/:id/members', function(req, res) {
    var param = {
        roleGroupId : req.params.id,
        userId : req.query.userId
    };
    rolegroupDao.updateForRoleGroupUsers(param, function(){
      RestResponse.success(res, req.query.uuid, errorCode.OK);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  
  /**
   * @api {put} /rolegroups/:id/roles 롤 그룹에 롤 추가     
   * @apiName updateRoleToRolegroups
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
   *     "contents": "ok"
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
  router.put('/:id/roles', function(req, res) {
    var param = {
        roleGroupId : req.params.id,
        groupRole : req.query.newGroupRoles
    };
    rolegroupDao.updateForRoleGroup(param, function(){
      RestResponse.success(res, req.query.uuid, errorCode.OK);
    }, function(code, message){
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });

  router.get('/findByName', function(req, res) {
    console.log('find Role_group by name', req.query);
    var param = {name : req.query.name};
    rolegroupService.findByName(param, function(data) {
      RestResponse.success(res, req.query.uuid, errorCode.OK, data);
    }, function(code, message) {
      RestResponse.failure(res, req.query.uuid, code, message);
    });
  });
  

};
