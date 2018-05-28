define(['app'], function(app){
  
app.factory('api/broker/resources', function(WrappedRestApi, RestApi, $log) {
    var brokers = RestApi.all('brokers');
    var brokerOne = RestApi.one('brokers');
    var brokerWrap = WrappedRestApi.one('brokers');
    return {
      /*
       * 주선소 리스트
       */
      getBrokers : function(param, ok, fail) {
        $log.debug("broker List : ", param);
        broker.getList(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 주선소 리스트
       */
      getBroker : function(param, ok, fail) {
        brokers.one(''+param.id).get().then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 주선소 정보 등록
       */
      create : function(param, ok, fail) {
        $log.debug("broker create : ", param);
        broker.post(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 주선소 정보 삭제
       */
      delete : function(param, ok, fail) {
        $log.debug("broker delete : ", param);
        brokerOne.all(param.id).remove(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 주선소 정보 수정
       */
      update : function(param, ok, fail) {
        $log.debug("broker update : ", param);
        broker.one(''+param.id).put(param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 주선소 멤버 목록 조회
       * - GET /api/broker/:brokerId/members
       */
      showMembers : function(param, ok, fail) {
        $log.debug("broker resources showMembers : ", param);
        brokerWrap.one(''+param.broker_id).one('members').get(param).then(function(data){
          $log.debug('data', data);
          ok(data);
        }, function(response) {
          $log.debug('error', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      }, 
      /*
       * 주선소 멤버 등록
       * - POST /api/broker/:brokerId/members
       */
      addMember : function(param, ok, fail) {
        $log.debug("broker resources addMember : ", param);
        brokers.one(''+param.broker_id).post('members', param).then(function(data){
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      }, 
      /*
       * 주선소 멤버 삭제
       * - /api/broker/:brokerId/members/:userId
       */
      deleteMember : function(param, ok, fail){
        $log.debug("broker resources deleteMember : ", param);
        brokers.one(''+param.broker_id).all('members').one('' + param.user_id).remove(param).then(function(data){
          ok(data);
        },function(response){
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 주선소 멤버 수정
       */
      updateMember : function(param, ok, fail){
        $log.debug("broker resources updateMember : ", param);
        brokers.one(''+param.broker_id).all('members').one('' + param.user_id).put(param).then(function(data){
          ok(data);
        },function(response){
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      
      /*
       * 주선수 등록 가능한 멤보 조회
       * - /api/brokers/members
       */
      findMembers : function(param, ok, fail) {
        $log.debug("broker resources findMembers : ", param);
        brokerWrap.one('members').one('find').get(param).then(function(data){
          $log.debug("broker resources findMembers data: ", data);
          ok(data);
        }, function(response) {
          $log.debug('error', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      
      
      
      /********** api/broker/:broker_id/consigners **********/
      // CAM-32
      // 주선소에 속한 화주 리스트 
      listConsignerByBroker : function(param, ok, fail){
        brokers.one(''+param.broker_id).getList("consigners", param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', 'response');
          if(angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      
    }; // end of return
  });
});
