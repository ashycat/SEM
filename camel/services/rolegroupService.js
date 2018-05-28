'use strict';

var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction')
var rolegroupDao = require('../dao/rolegroup');

var RoleGroupService = function() {
  return {
    /**
     * 롤그룹 목록 검색
     */ 
    findByName : function(param, success, fail) {
      console.log('service param', param);
      var controls = [{fn:rolegroupDao.findByName, param:param}];
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    }, 
    
  }
}
  
module.exports = RoleGroupService();