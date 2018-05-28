'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var brokerGroupsDao = require('../dao/brokerGroups');
var brokerGroupMembersDao = require('../dao/brokerGroupMembers');

var BrokerGroupService = function() {
  return {
    /**
     * 주선소 그룹 목록 조회
     */ 
    list : function(param, success, fail) {
      // TODO
    }, 
    /**
     * 주선소 그룹 검색
     */
    findAll : function(param, success, fail) {
      // TODO
    },    
    /**
     * 개별 주선소 그룹 조회
     */  
    findOne : function(param, success, fail) {
      // TODO
    }, 
    /**
     * 주선소 그룹 등록
     */ 
    create : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:brokerGroupsDao.create, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 주선소 그룹 수정
     */ 
    update : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:brokerGroupsDao.update, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 주선소 그룹 삭제
     * - 전제 : 주선소 그룹에 등록된 주선소가 없을때 삭제 가능(생성주선소는 제외)
     */ 
    delete : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:brokerGroupsDao.delete, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    
    /**
     * 주선소 그룹 멤버 목록 조회
     */
    listMember : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:brokerGroupMembersDao.list, param:param});
      controls.push({fn:brokerGroupMembersDao.listCount, param:param});
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    },
    
    /**
     * 주선소 그룹 멤버 추가 
     */
    addMember : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:brokerGroupMembersDao.create, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    
    /**
     * 주선소 그룹 멤버 수정
     */
    updateMember : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:brokerGroupMembersDao.update, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    
    /**
     * 주선소 그룹 멤버 삭제
     */
    deleteMember : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:brokerGroupMembersDao.delete, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    
  };
};
  
module.exports = new BrokerGroupService();