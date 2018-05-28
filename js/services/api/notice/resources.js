define(['app'], function(app){
  
app.factory('api/notice/resources', function(WrappedRestApi, $log) {
    var notices = WrappedRestApi.all('notices');
    var noticesOne = WrappedRestApi.one('notices');
    return {
      // 공지 조회
      getNotice : function(param, ok, fail) {
        notices.one(''+param.id).get().then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 공지 목록 조회 
      getNotices : function(param, ok, fail) {
        noticesOne.get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 공지 등록
      addNotice : function(param, ok, fail) {
        notices.post(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 공지 수정 
      modifyNotice : function(param, ok, fail) {
        notices.one(""+param.id).put(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 공지 삭제 
      deleteNotice : function(param, ok, fail) {
        notices.one(""+param.id).remove().then(function(data) {
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