define(['app'], function(app){
  
app.factory('api/allocation/resources', function(WrappedRestApi, RestApi, $log) {
    var allocations = RestApi.all('allocations');
    var allocationOne = RestApi.one('allocations');
    var wallocations = WrappedRestApi.all('allocations');
    return {
      /*
       * 배차 
       */
      allocateOrder : function(param, ok, fail) {
        allocations.post(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      allocatedOrderList : function(param, ok, fail) {
        wallocations.one("find").get(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      cancelAllocatedOrder : function(param, ok, fail) {
        allocations.one(""+param.id).remove().then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      }
    };
  });
});
