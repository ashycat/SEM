'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction')
var brokerDao = require('../dao/broker');

var BrokerService = function() {
  return {
    /**
     * 주선소 목록 조회
     */ 
    list : function(param, success, fail) {
      brokerDao.list(param, success, fail);
    }, 
    /**
     * 주선소 검색
     */
    findAll : function(param, success, fail) {
      brokerDao.find(param, success, fail);
    },    
    /**
     * 개별 주선소 조회
     */  
    findOne : function(param, success, fail) {
      brokerDao.one(param, success, fail);
    }, 
    /**
     * 주선소 등록
     */ 
    createBroker : function(param, success, fail) {
      console.log('service param : ', param);
      brokerDao.create(param, success, fail);
    },
    /**
     * 주선소 수정
     */ 
    updateBroker : function(param, success, fail) {
      brokerDao.update(param, success, fail);
    },
    /**
     * 주선소 삭제
     */ 
    deleteBroker : function(param, success, fail) {
      brokerDao.delete(param, success, fail);
    },
    
    /**
     * 주선소 멤버 목록 조회
     */
    showMembers : function(param, success, fail) {
      brokerDao.showMembers(param, success, fail);
    },
    /**
     * 주선소 멤버 등록
     */
    addMember : function(param, success, fail) {
      brokerDao.addMember(param, success, fail);
    },
    /**
     * 주선소 멤버 삭제
     */
    deleteMember : function(param, success, fail) {
      brokerDao.deleteMember(param, success, fail);
    },
    /**
     * 주선소 멤버 수정
     */
    updateMember : function(param, success, fail) {
      brokerDao.updateMember(param, success, fail);
    },
    
    /**
     * 주선소 등록 가능한 멤버 조회
     */
    findMembers : function(param, success, fail) {
      brokerDao.findMembers(param, success, fail);
    }
  }
};
  
module.exports = BrokerService();