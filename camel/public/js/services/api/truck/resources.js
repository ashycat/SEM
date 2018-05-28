define(['app'], function(app){
  
app.factory('api/truck/resources', function(WrappedRestApi, RestApi, $log) {
    var trucks = RestApi.all('trucks');
    var truckOne = RestApi.one('trucks');
    return {
      /*
       * 트럭정보 
       */
      getTrucksByUser : function(param, ok, fail) {
        truckOne.get(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 트럭검색 
       */
      findTrucks : function(param, ok, fail) {
        trucks.all("find").getList(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      }
    };
  });
});
