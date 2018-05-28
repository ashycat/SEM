define(['app'], function(app){
  
app.factory('api/consigner/resources', function(WrappedRestApi, RestApi, $log) {
    var consigners = RestApi.all('consigners');
    var consignerOne = RestApi.one('consigners');
    return {
      /*
       * 화주 리스트
       */
      list : function(param, ok, fail) {
        $log.debug("consigner List : ", param);
        consigners.getList(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 화주정보 등록
       */
      create : function(param, ok, fail) {
        $log.debug("consigner create : ", param);
        consigners.post(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 화주정보 삭제
       */
      delete : function(param, ok, fail) {
        $log.debug("consigner delete : ", param);
        consignerOne.all(param.id).remove(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 화주 정보 수정
       */
      update : function(param, ok, fail) {
        $log.debug("consigner update : ", param);
        consigners.one(''+param.id).put(param).then(function(data){
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
      findConsigners : function(param, ok, fail) {
        consigners.all("find").getList(param).then(function(data) {
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
