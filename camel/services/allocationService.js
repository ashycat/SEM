'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction')
var allocationDao = require('../dao/allocation');
var orderDao = require('../dao/order');

var AllocationService = function() {
  return {
    /**
     * 배차 목록 조회
     */ 
    list : function(param, success, fail) {
      var controls = [{fn:allocationDao.list, param:param},
                      {fn:allocationDao.listCount, param:param},
                      ];
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    }, 
    /**
     * 배차 내역 검색
     */
    find : function(param, success, fail) {
      var controls = [{fn:allocationDao.find, param:param},
                      {fn:allocationDao.findCount, param:param},
                      ];
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    },    
    /**
     * 개별 배차 조회
     */  
    findOne : function(param, success, fail) {
      var controls = [{fn:allocationDao.findOne, param:param}];
      tx.Rpipe(controls, tx.Rcallback, success, fail);
    }, 
    /**
     * 배차 등록
     */ 
    createAllocation : function(param, success, fail) {
      var controls = [{fn:allocationDao.createAllocation, param:param}];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 배차 취소
     */ 
    deleteAllocation : function(param, success, fail) {
      var controls = [{fn:allocationDao.deleteAllocation, param:param}];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 배차된 offer (차량) 정보 조회 
     */
    allocatedOffer : function(param, success, fail) {
      var controls = [{fn:allocationDao.allocatedOffer, param:param}];
      tx.Rpipe(controls, tx.Rcallback, success, fail);
//      allocationDao.allocatedOffer(param, success, fail);
    }
  }
}
  
module.exports = AllocationService();