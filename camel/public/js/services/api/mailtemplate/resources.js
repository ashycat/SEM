define(['app'], function(app){
  
app.factory('api/mailtemplate/resources', function(WrappedRestApi, RestApi, $log) {
    var mailtemplates = WrappedRestApi.all('mailtemplates');
    var mailreceivergroups = WrappedRestApi.all('mailtemplates');
    var mailtemplateOne = WrappedRestApi.one('mailtemplates');
    return {
      // 유저 목록 조회 
      getMailtemplates : function(param, ok, fail) {
        mailtemplateOne.get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      getMailtemplate : function(param, ok, fail) {
        mailtemplates.one(''+param.id).get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      getReceiverByMailtemplate : function(param, ok, fail) {
        mailtemplates.one(''+param.id).one("rolegroups").get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 메일 템플릿 생성 
       */
      create : function(param, ok, fail) {
        mailtemplates.post(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 메일 템플릿 컨텐츠 수정 
       */
      modifyMailtemplate : function(param, ok, fail) {
        mailtemplates.one(''+param.id).put(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 메일 수신자 그룹 수정 
       */
      modifyReceiverGroup : function(param, ok, fail) {
        mailtemplates.one(''+param.id).all("rolegroups").post(param).then(function(data) {
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