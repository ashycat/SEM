define(['app'], function(app){
  
app.factory('api/google/resources', function(WrappedRestApi, RestApi, $http, $log) {
  
    return {
      getAddresses : function(address, ok) {
        var params = {address: address, sensor: false};
        return $http.get(
          'http://maps.googleapis.com/maps/api/geocode/json',
          {params: params}
        ).then(function(response) {
          ok(response.data.results);
        });
      },
    };
  });
});