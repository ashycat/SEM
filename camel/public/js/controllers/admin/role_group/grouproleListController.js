/**
 * New node file
 */

define(['app', 'services/api/role_group/resources', 'services/api/user/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('admin/role_group/grouproleListController', 
    ['$scope', 'api/role_group/resources', 'api/user/resources', 'sweetAlert', '$modal', '$log', '$modalInstance', 'items', 'reload', 'getRoles',   
      function ($scope, resources, userresources, sweetAlert, $modal, $log, $modalInstance, items, reload, getRoles) {
          
         var basegrouproles;
      $log.debug('Group role\'s ID : ', items.id);
          
        resources.getRoleList({}, function(data){
        $scope.rolelist = data;
        $log.debug('rolelist', $scope.rolelist[0].name);         
        });
  
        resources.getGroupRoles(items.id, function(data) {
          $log.debug('grouproles', data);
          $scope.grouproles = new Array(data.length);
          basegrouproles = new Array(data.length);
          for (var i=0; i < data.length; i++){
            $scope.grouproles[i] = data[i].name;
            basegrouproles[i] = data[i].name;
          }
          basegrouproles.sort();
        });
        
        $scope.ok = function () {
          $log.debug($scope.grouproles.length);
          $scope.grouproles.sort();
            
          if (angular.equals($scope.grouproles, basegrouproles)) {
            $log.debug("is equals");
          } else {
            // merge
            var param = {
              roleGroupId : items.id,
              newGroupRoles : $scope.grouproles
            };
             
            resources.mergeRole(param, function(data) {
              reload();
              //$modalInstance.dismiss('cancel');
            });
          }
        };
           
   
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      }
    ]
  );
});
