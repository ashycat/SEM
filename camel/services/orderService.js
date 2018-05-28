'use strict';

var pool = require('../lib/generic-pool');
var errorCode = require('../lib/errorCode');
var tx = require('../lib/transaction')
var goodsDao = require('../dao/goods');
var orderDao = require('../dao/order');
var offerDao = require('../dao/offer');
var allocationDao = require('../dao/allocation');
var async = require('async');

var OrderService = function() {
  return {
    /**
     * 오더 목록 조회
     */ 
    list : function(param, success, fail) {
      var controls = [];
      
      if (param.qType == 'broker') {
        controls.push({fn:orderDao.listForBroker, param:param});
        controls.push({fn:orderDao.listCountForBroker, param:param});
      } else if (param.qType == 'truck_user') {
        controls.push({fn:orderDao.listForTruckUser, param:param});
        controls.push({fn:orderDao.listCountForTruckUser, param:param});
      } else {
        controls.push({fn:orderDao.list, param:param});
        controls.push({fn:orderDao.listCount, param:param});
      }
      tx.Rparallel(controls, tx.Wcallback, success, fail);
    }, 
    /**
     * 오더 검색
     */
    find : function(param, success, fail) {
      orderDao.find(param, success, fail);
    },    
    /**
     * 개별 오더 조회
     */  
    findOne : function(param, success, fail) {
      var controls = [{fn:orderDao.findOne, param:param}];
      tx.Rpipe(controls, tx.Wcallback, success, fail);
    }, 
    /**
     * 오더 등록
     */ 
    create : function(param, success, fail) {
      var controls = [{fn:goodsDao.createGoods, param:param},
                      {fn:orderDao.createOrder, param:param},
                      ];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 오더 수정
     */ 
    update : function(param, success, fail) {
      var controls = [{fn:goodsDao.updateGoods, param:param},
                      {fn:orderDao.updateOrder, param:param},
                      ];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
    /**
     * 오더 삭제
     * TODO : 오더를 삭제하는 것은 status를 DELETE로 바꾸는 것으로 한다. 
     * 단, 연결되어 있는 배차정보는 어떻게 끊어야 하나 ? 
     * 지워버리나 ? 같이 status 처리하나 ? (status 처리해도 큰 의미가 없어 보인다. )
     */ 
    delete : function(param, success, fail) {
      var controls = [{fn:orderDao.deleteOrder, param:param}];
      if (param.all == 'true') {
        controls.push({fn:goodsDao.deleteGoods, param:param});
      }
      tx.Wparallel(controls, tx.Wcallback, success, fail);
    },
    /**
     * 배차 신청 등록 
     * 1. offer를 생성한다.
     * 2. allocation을 생성한다. (order_id, offer_id : 1번에서 생성한 offer의 id를 이용)
     * 3. order의 is_alloc을 1로 변경한다. 
     */ 
    allocate : function(param, success, fail) {
      var controls = [{fn:offerDao.createOffer, param:param},
                      {fn:allocationDao.createAllocation, param:param},
                      {fn:orderDao.updateAllocationStatus, param:param},
                      ];
      tx.Wpipe(controls, tx.Wcallback, success, fail);
    },
  }
}
  
module.exports = OrderService();