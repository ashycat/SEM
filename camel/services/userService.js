'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var userDao = require('../dao/user');
var userBusinessDao = require('../dao/userBusiness');
var truckDao = require('../dao/truck');

var UserService = function() {
  return {
    /**
     * 유저 리스트
     */
    list : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.list, param:param});
      controls.push({fn:userDao.listCount, param:param});
      tx.Rparallel(controls, tx.Wcallback, success, fail);
    },
    /**
     * 유저 등록
     * 유저 등록시 apikey, secretkey 등록도 같이 되어야 한다.
     */
    create : function(param, success, fail) {
      console.log('service create : ', param);
      var controls = [];
      controls.push({fn:userDao.create, param:param});
      controls.push({fn:userDao.createApikey, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 차량 유저 등록
     * 유저 등록시 apikey, secretkey 등록도 같이 되어야 한다.
     */
    createTruckUser : function(param, success, fail) {
      console.log('service createTruckUser : ', param);
      var controls = [];
      controls.push({fn:truckDao.listCountByBrokerId, param:param});
      tx.Rpipe(controls, tx.Rcallback, function(result){
        
        param.sizeTruckUsers = result.size;
        controls = [];
        controls.push({fn:userDao.createTruckUser, param:param});
        controls.push({fn:userDao.createApikey, param:param});
        tx.Wpipe(controls, tx.Wcallback, success, fail);
      }, fail);
      
    },
    /**
     * 사용자(차주) 사업자 정보 등록
     */
    createBusiness : function(param, success, fail) {
      console.log('service createBusiness : ', param);
      var controls = [];
      controls.push({fn:userBusinessDao.create, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 주선소 등록 가능한 유저 조회
     */
    listByUnassignBroker : function(param, success, fail) {
      console.log('service listByUnassignBroker : ', param);
      var controls = [];
      controls.push({fn:userDao.listByUnassignBroker, param:param});
      tx.Rparallel(controls, tx.Wcallback, success, fail);
    },
     /**
     * 개별 유저 조회
     * id로 조회
     */
    findOne : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.one, param:param});
      tx.Rpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 유저 status 수정
     * id로 조회
     * status수정되면
     * action_key삭제
     */
    updateStatus : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.updateStatus, param:param});
      controls.push({fn:userDao.deleteActionKey, param:param});
      tx.Rpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 유저 아이디 중복 체크
     * user_id로 조회
     */
    checkUserId : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.checkUserId, param:param});
      tx.Rpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 폰 번호로 사용자 검색 
     * 사용자 검색시 폰번호로 사용자를 검색한다. 
     */
    findByPhone : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.findByPhone, param:param});
      tx.Rparallel(controls, tx.Wcallback, success, fail);
    },
    /**
     * 비밀번호 수정
     * users테이블의 id정보를 기반으로 비밀번호를 수정한다.
     */
    updatePassword : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.updatePassword, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 기본 정보 수정
     */
    update : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.update, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 유저 삭제
     */
    delete : function(param, success, fail) {
      var controls = [];
      controls.push({fn:userDao.delete, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
  }
}

module.exports = UserService();