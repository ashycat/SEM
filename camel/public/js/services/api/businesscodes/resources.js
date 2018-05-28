define(['app'], function(app){
  
app.factory('api/businesscodes/resources', function(WrappedRestApi, RestApi, $log) {
    var businessCodes = RestApi.all('businesscodes');
    var businessCodeOne = RestApi.one('businesscodes');
    return {
      
      /*
       * 사업자 업태 목록 조회
       */
      findBusinessCondition : function(param, ok, fail) {
        businessCodes.all('condition').getList(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      }, 
      
      /*
       * 사업자 업종 목록 조회
       */
      findBusinessType : function(param, ok, fail) {
        businessCodes.all('type').getList(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      }, 
      
    };
  });
});
