'use strict';

var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction')
var messageDao = require('../dao/message');
var messageReceiverDao = require('../dao/messageReceiver');

var MessageService = function() {
  return {
    /**
     * 메시지 목록 조회
     */ 
    list : function(param, success, fail) {
      var controls = [{fn:messageDao.list, param:param},
                      {fn:messageDao.listCount, param:param},
                      ];
      tx.Rparallel(controls, tx.Rcallback, success, fail);
    }, 
    listForReceiver : function(param, success, fail) {
      var controls = [{fn:messageDao.listForReceiver, param:param}];
      tx.Rseries(controls, tx.Rcallback, success, fail);
    },
    /**
     * 메시지 검색
     */
    find : function(param, success, fail) {
      messageDao.find(param, success, fail);
    },    
    /**
     * 개별 메시지 조회
     */  
    findOne : function(param, success, fail) {
      var controls = [];
      // userId가 있는 경우에는 읽음 체크를 한다. 
      if (param.userId) {
        controls.push({fn:messageDao.checkReading, param:param});
      }
      controls.push({fn:messageDao.findOne, param:param});
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    }, 
    /**
     * 메시지 등록
     */ 
    create : function(param, success, fail) {
      var controls = [{fn:messageDao.createMessage, param:param}];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 메시지 수정
     */ 
    update : function(param, success, fail) {
      var controls = [{fn:messageDao.updateMessage, param:param}];
      tx.Wparallel(controls, tx.Wcallback, success, fail)
    },
    /**
     * 메시지 삭제
     */ 
    delete : function(param, success, fail) {
      var controls = [{fn:messageDao.deleteMessage, param:param}];
      tx.Wparallel(controls, tx.Wcallback, success, fail);
    },
    /**
     * 메시지 수신자 조회 
     */
    listReceiver : function(param, success, fail) {
      messageReceiverDao.listByMessage(param, success, fail);
    },
    /**
     * 메시지 수신자 추가  
     */
    addReceiver : function(param, success, fail) {
      var controls = [{fn:messageReceiverDao.createReceiver, param:param}];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    }
    
  }
}
  
module.exports = MessageService();