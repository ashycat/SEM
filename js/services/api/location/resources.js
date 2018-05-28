define(['app'], function(app){
  
app.factory('api/location/resources', function(WrappedRestApi, RestApi, $log) {
    var locations = RestApi.all('locations');
    var locationsOne = WrappedRestApi.one('locations');
    return {
      // 위치 검색
      findLocations : function(param, ok, fail) {
        $log.debug("findLocations : ", param);
        locations.all("find").getList(param).then(function(data){
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