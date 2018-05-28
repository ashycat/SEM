
/**
 * 
 * updateOrderController
 * 
 */
'use strict';

define(['app', 
        'services/api/broker/resources', 
        ], function(app){
  app.controller('broker/updateMemberController',
      ['$scope', 'api/broker/resources', '$modalInstance', '$cookies', 'reload', 'param', '$log',  
        function ($scope, $brokerResources, $modalInstance, $cookies, $reload, $param, $log) {
        $log.debug('broker updateMemberController', $param);
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.member = $param.member;
        
        
        // 저장
        $scope.save = function() {
          var param = {
              user_id : $scope.member.user_id,
              broker_id : $scope.member.broker_id,
              broker_role : $scope.member.role,
              creator : $cookies.id
          };
          $brokerResources.updateMember(param, function(result) {
            //sweetAlert.swal("삭제완료", "삭제되었습니다", "success");
            $scope.showMembers();
            $modalInstance.close();
          });
        };
  }]);
});
