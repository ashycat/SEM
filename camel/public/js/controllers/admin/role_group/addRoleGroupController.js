/**
 * 
 * role_groupController
 * 
 */

define(['app', 'services/api/role_group/resources', 'services/api/user/resources', 'factories/sweet-alert'], function(app){
  app.controller('admin/role_group/addRoleGroupController', 
      ['$scope', 'api/role_group/resources','api/user/resources', 'sweetAlert', '$modal', '$log', '$modalInstance', 'reload',   
       function ($scope, resources, userresources, sweetAlert, $modal, $log, $modalInstance, reload) {
    
    $scope.insertOk = function () {
      var param = { 
          name : $scope.role_group_name,
      };
      resources.addRoleGroup(param, function() {
        reload();
      });
      $modalInstance.close();
    };
    
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
  ]);
});
