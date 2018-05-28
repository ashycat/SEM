'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var truckDao = require('../dao/truck');

var TruckService = function() {
  return {
    /**
     * 주선소 차주 이용 정지
     */
    stop : function(param, success, fail) {
      console.log('service param : ', param);
      
      var controls = [];
      controls.push({fn:truckDao.update, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    
  }
}

module.exports = TruckService();