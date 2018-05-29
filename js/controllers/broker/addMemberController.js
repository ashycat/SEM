
/**
 * 
 * addMemberController
 * 
 */

define(['app', 
        'services/api/broker/resources', 
        ], function(app){
  'use strict';
  app.controller('broker/addMemberController',
      ['$scope', 'api/broker/resources', '$modalInstance', '$cookies', 'reload', '$log',  
        function ($scope, $brokerResources, $modalInstance, $cookies, $reload, $log) {
        $log.debug('broker addMemberController' );
        $scope.currentPage = 1;
        $scope.pageChanged = function() {
          var param = {
              limit : 10,
              page : $scope.currentPage - 1,
          };
          $brokerResources.findMembers(param, function(result) {
            $scope.addMembers = result.contents;
            $scope.addMembers_info = result.info;
          });
        };
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
        
        
        $scope.addMember = function(index) {
          var param = {
              broker_id : $cookies.brokerId,
              user_id : $scope.addMembers[index].id,
              broker_role : $scope.addMembers[index].broker_role,
              creator : $cookies.id
          };
          $brokerResources.addMember(param, function(result) {
            $scope.showMembers();
            $modalInstance.close();
          });
          
        };
        
  }]);
});
