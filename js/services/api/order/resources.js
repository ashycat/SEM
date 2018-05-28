define(['app'], function(app){
  
app.factory('api/order/resources', function(WrappedRestApi, RestApi, $log) {
    var orders = WrappedRestApi.all('orders');
    var orderOne = WrappedRestApi.one('orders');
    var restOrders = RestApi.all('orders');
    return {
      // 오더 목록 조회 
      getOrders : function(param, ok, fail) {
        orderOne.get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('fail response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 오더 조회
      getOrder : function(param, ok, fail) {
        restOrders.one(''+param.id).get().then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('fail response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 오더 등록
      addOrder : function(param, ok, fail) {
        orders.post(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('fail response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 오더 수정 
      modifyOrder : function(param, ok, fail) {
        orders.one(""+param.id).put(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('fail response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 오더 삭제 
      deleteOrder : function(param, ok, fail) {
        orders.one(""+param.id).remove().then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('fail response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 배차 
       */
      allocateOrder : function(param, ok, fail) {
        orders.one(""+param.id).all('allocations').post(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      getOfferByOrderId : function(param, ok, fail) {
        restOrders.one(""+param.id).one('offers').get(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
    };
  });
});