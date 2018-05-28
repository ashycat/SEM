'use strict';

var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction');
var mailtemplateDao = require('../dao/mailtemplate');
var check = require('check-types');
//var mailtemplateReceiverDao = require('../dao/mailtemplateReceiver');

var MailtemplateService = function() {
  return {
    /**
     * 메일템플릿 조회 
     */ 
    one : function(param, success, fail) {
      var controls = [
                      {fn:mailtemplateDao.one, param:param},
      ];
      tx.Rseries(controls, tx.Rcallback, success, fail);
    },
    /**
     * 메일템플릿 목록 조회
     */ 
    list : function(param, success, fail) {
      var controls = [{fn:mailtemplateDao.list, param:param},
                      {fn:mailtemplateDao.listCount, param:param}
                      ];
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    },
    listForReceiver : function(param, success, fail) {
      var controls = [{fn:mailtemplateDao.listForReceiver, param:param}];
      tx.Rseries(controls, tx.Rcallback, success, fail);
    },
    /**
     * 메일템플릿 등록 
     */
    create : function(param, success, fail) {
      var controls = [{fn:mailtemplateDao.create, param:param}];
      tx.Wseries(controls, tx.Wcallback, success, fail);
    },
    /**
     * 메일템플릿 컨텐츠 수정
     */
    updateMailtemplate : function(param, success, fail) {
      var controls = [{fn:mailtemplateDao.updateMailtemplate, param:param}];
      tx.Wseries(controls, tx.Wcallback, success, fail);
    },
    /**
     * 메일템플릿 컨텐츠 수정
     */
    updateReceiverGroup : function(param, success, fail) {
      var controls = [{fn:mailtemplateDao.deleteReceiverGroup, param:param}];
        if( !check.undefined(param.receiverGroup)) {
          controls.push({fn:mailtemplateDao.createReceiverGroup, param:param});
        }
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
  };
};
  
module.exports = MailtemplateService();