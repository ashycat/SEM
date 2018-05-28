define(['app'], function(app){
  
app.factory('api/user/resources', function(RestApi, $log) {
    var users = RestApi.all('users');
    var userOne = RestApi.one('users');
    var search = RestApi.all('search/users');
    var logout = RestApi.one('logout');
    return {
      // 유저 목록 조회 
      getUsers : function(param, ok, fail) {
        users.getList(param).then(function(data) {
          $log.debug('data', data);
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 유저 등록
      addUser : function(param, ok, fail) {
        users.post(param).then(function(data) {
          $log.debug('data', data);
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 유저 수정 
      modifyUser : function(param, ok, fail) {
        users.one(""+param.id).put(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      //비밀번호 수정
      modifyPassword : function(param, ok, fail) {
        userOne.all(""+param.id).one('password').put(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 유저 삭제 
      deleteUser : function(param, ok, fail) {
        users.one(""+param.id).remove().then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 로그인 유저 정보
      findById : function(param, ok, fail) {
      	users.one(""+param).get().then(function(data) {
      		ok(data);
      	}, function(response) {
      		if (angular.isFunction(fail)) {
            fail(response);
          }
      	});
      },
      findByUsername : function(param, ok, fail) {
        users.all("find").getList(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      findByPhone : function(param, ok, fail) {
        users.all("findByPhone").getList(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /**
       * 아이디 중복 체크
       */
       checkUserId : function(param, ok, fail) {
        userOne.all(param.user_id).one("check").get().then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      
      logout : function(param, ok,fail) {
        logout.get().then(function(data) {
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