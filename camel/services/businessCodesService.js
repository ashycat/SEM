'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var businessCodesDao = require('../dao/businessCodes');

var BusinessCodesService = function() {
  return {

    /**
     * 사업자 업태 목록 조회
     *
     */ 
    findBusinessCondition : function(param, success, fail) {
      businessCodesDao.findBusinessCondition(param, success, fail);
    },
  
    /**
     * 사업자 업종 목록 조회
     */ 
    findBusinessType : function(param, success, fail) {
      businessCodesDao.findBusinessType(param, success, fail);
    } 

  }
};
  
module.exports = BusinessCodesService();

