define(['app'], function(app){
  
app.factory('api/message/resources', function(WrappedRestApi, RestApi, $log) {
    var messages = WrappedRestApi.all('messages');
    var messagesOne = WrappedRestApi.one('messages');
    var restMessages = WrappedRestApi.all('messages');
    var userMessage = RestApi.all('users');
    return {
      // 메시지 조회
      getMessage : function(param, ok, fail) {
        messages.one(''+param.id).get().then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 메시지 목록 조회 
      getMessages : function(param, ok, fail) {
        messagesOne.get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 사용자 특정 메시지 목록 조회 
      getMessagesByUser : function(param, ok, fail) {
        userMessage.one('' + param.userId).all('messages').getList(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 메시지 목록 조회 
      getReceiverByMessage : function(param, ok, fail) {
        var receivers = messages.one(''+param.id).one('receivers');
        receivers.get().then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 메시지 등록
      addMessage : function(param, ok, fail) {
        messages.post(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 메시지 수신자 등록
      addReceiver : function(param, ok, fail) {
        restMessages.all("" + param.message_id).all('receivers').post(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 메시지 수정 
      modifyMessage : function(param, ok, fail) {
        messages.one(""+param.id).put(param).then(function(data) {
          ok(data);
        }, function(response) {
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 메시지 삭제 
      deleteMessage : function(param, ok, fail) {
        messages.one(""+param.id).remove().then(function(data) {
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