'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var consignerMemberDao = require('../dao/consignerMember');
var consignerDao = require('../dao/consigner');
var consignerBusinessDao = require('../dao/consignerBusiness');

var ConsignerService = function() {
  return {
    /**
     * 화주 목록 조회
     *  - 전체 목록
     *  - CAM-32 주선소에 속한 화주 목록
     */ 
    list : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      if (param.broker_id) {
        controls.push({fn:consignerDao.listByBroker, param:param});
        controls.push({fn:consignerDao.listCountByBroker, param:param});
      } else {
        controls.push({fn:consignerDao.list, param:param});
        controls.push({fn:consignerDao.listCount, param:param});
      }
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    },
    /**
     * 화주 검색
     */
    find : function(param, success, fail) {
      var controls = [{fn:consignerDao.find, param:param}];
      tx.Rpipe(controls, tx.RcallbackNN, success, fail);
    },    
    /**
     * 개별 화주 조회
     */  
    findOne : function(param, success, fail) {
      var controls = [{fn:consignerDao.findOne, param:param}];
      tx.Rpipe(controls, tx.RcallbackNN, success, fail);
    }, 
    /**
     * 화주 등록
     */ 
    createConsigner : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:consignerDao.create, param:param});
      //controls.push({fn:consignerMemberDao.create, param:param});
      //controls.push({fn:consignerBusinessDao.create, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 화주 수정
     */ 
    updateConsigner : function(param, success, fail) {
      var controls = [{fn:consignerDao.update, param:param}];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 화주 삭제
     */ 
    deleteConsigner : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:consignerDao.deleteConsigner, param:param});
      controls.push({fn:consignerMemberDao.deleteByConsigner, param:param});
      controls.push({fn:consignerBusinessDao.deleteByConsigner, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 담당자 등록
     */
    createConsignerMember : function(param, success, fail) {
      console.log('service createConsignerMemeber param : ', param);
      var controls = [];
      controls.push({fn:consignerMemberDao.create, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 담당자 수정
     */
    updateConsignerMember : function(param, success, fail) {
      console.log('service updateConsignerMemeber param : ', param);
      var controls = [];
      controls.push({fn:consignerMemberDao.update, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 화주에 속한 담당자 개별 삭제
     */
    deleteConsignerMember : function(param, success, fail) {
      console.log('service deleteConsignerMemeber param : ', param);
      var controls = [];
      controls.push({fn:consignerMemberDao.delete, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    
    
    /******************** 사업자 정보 관련 ********************/
    /**
     * 사업자 정보 등록 
     */
    createConsignerBusiness : function(param, success, fail) {
      console.log('service createConsignerBusiness param : ', param);
      var controls = [];
      controls.push({fn:consignerBusinessDao.create, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 사업자 정보 수정
     */
    updateConsignerBusiness : function(param, success, fail) {
      console.log('service updateConsignerBusiness param : ', param);
      var controls = [];
      controls.push({fn:consignerBusinessDao.update, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 사업자 정보 삭제
     */
    deleteConsignerBusiness : function(param, success, fail) {
      console.log('service deleteConsignerBusiness param : ', param);
      var controls = [];
      controls.push({fn:consignerBusinessDao.deleteByConsigner, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    
  };
};
  
module.exports = new ConsignerService();