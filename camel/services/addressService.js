'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var locationsAddressDao = require('../dao/locationsAddress');

var LocationsAddressService = function() {
  return {
    /**
     * 지번 우편번호 조회(검색) 
     */ 
    listByLocationName : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:locationsAddressDao.listByLocationName, param:param});
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    }, 
    /**
     * 도로명 우편번호 조회(검색) 
     */
    listByRoadName : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:locationsAddressDao.listByRoadName, param:param});
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    },    
    /**
     * 주소 조회 
     */  
    detail : function(param, success, fail) {
      console.log('service param : ', param);
      var controls = [];
      controls.push({fn:locationsAddressDao.detail, param:param});
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    },
    
  };
};
  
module.exports = new LocationsAddressService();