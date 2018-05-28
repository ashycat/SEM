define(['app'], function(app){
  
app.factory('api/mail/resources', function(WrappedRestApi, RestApi, $log) {
    var mails = RestApi.all('mails');
    var mailsOne = WrappedRestApi.one('mails');
    return {
      // 위치 검색
      send : function(param, ok, fail) {
        $log.debug("send : ", param);
        mails.all("send").post(param).then(function(data){
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