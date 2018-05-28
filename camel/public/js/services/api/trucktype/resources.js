define(['app'], function(app){
  
app.factory('api/trucktype/resources', function(WrappedRestApi, $log) {
    var trucktypes = WrappedRestApi.all('trucktypes');
    var trucktypeOne = WrappedRestApi.one('trucktypes');
    return {
      /*
       * 트럭종류정보 
       */
      getTrucktypelist : function(param, ok, fail) {
        trucktypeOne.get(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 트럭무게검색 
       */
      findTruckweight : function(param, ok, fail) {
        trucktypes.all("find").getList(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
      * 트럭종류추가 
      */
      addTrucktype : function(param, ok, fail) {
        trucktypes.post(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 트럭종류삭제 
       */
      deleteTrucktype : function(param, ok, fail) {
        trucktypes.one(""+param.id).remove().then(function(data) {
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
