'use strict';

var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var trucktypeDao = require('../dao/trucktype');

var TruckTypeService = function() {
  return {

    /**
     * 차종 목록 조회
     *
     */ 
    listTruckType : function(param, success, fail) {
      var controls = [{fn:trucktypeDao.list, param:param},
                      {fn:trucktypeDao.listCount, param:param},
                      ];
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    },
  
    /**
     * 차종별 중량 목록 조회
     */ 
    listWeightByTruckType : function(param, success, fail) {
      
    },
    
    /**
     * 차종 생성 
     */ 
    createTruckType : function(param, success, fail) {
      
    },
    
    /**
     * 차종 삭제  
     */ 
    deleteTruckType : function(param, success, fail) {
      
    }

  }
};
  
module.exports = TruckTypeService();

