/**
 * 
 * role_groupController
 * 
 */

define(['app', 'services/api/role_group/resources', 'services/api/user/resources', 'factories/sweet-alert'], function(app){
  app.controller('admin/role_group/showGroupUserController', 
      ['$scope', 'api/role_group/resources','api/user/resources', 'sweetAlert', '$modal', '$modalInstance', '$log', '$location', 'items', 'reload',  
       function ($scope, resources, userresources, sweetAlert, $modal,$modalInstance, $log, $location, items, reload) {
      
    $log.debug('showGroupUserController items.id',items.id);
    $scope.roleGroupId= items.id;
    
    $scope.getGroupUserList = function () {
      resources.getRoleGroupMember(items.id, function(data) {
        $scope.groupuserlist = data;
      });
    };
    $scope.getGroupUserList();
    
    
    $scope.userDeleteOk = function(row) {
      $log.debug("row ", items.id);
      $log.debug("row ",$scope.groupuserlist[row].id );
      
      var param = {
          userId : $scope.groupuserlist[row].id,
          roleGroupId : items.id
      };
      
      $log.debug("row is ", param);
      resources.deleteRoleGroupMember(param, function(data){
        $log.debug('userDeleteOk');
        $scope.getGroupUserList();
      });
    };
    
    $scope.ok = function () {
      //권한 
      $modalInstance.close();
    };
    
  //add rolegroupmember
    $scope.addRoleGroupMember = function () {
      $log.debug('addroleGroupMember()', items.id);
      var modalInstance = $modal.open({
        templateUrl: 'views/admin/role_group/add_rolegroupmember.html',
        controller: AddRoleGroupMemberCtrl,
        resolve: {
          reload : function() {
            return $scope.getGroupUserList;
          }
        }
      });
    };

    var AddRoleGroupMemberCtrl = function ($scope, $modalInstance, reload) {
      $log.debug("here ", items.id);
      $scope.searchUser = function() {
        $log.debug('$scope.user_name : ', $scope.user_name );
        var param = {
              username : $scope.user_name
        };
        userresources.findByUsername(param, function(data) {
          $scope.rolegroupmemberlist = new Array(data.length);
          for (var i=0; i < data.length; i++) {
            $scope.rolegroupmemberlistId[i] = data[i].id;
          }
          $scope.rolegroupmemberlist = data;
        });
      };
      
      // 롤그룹에 속해 있는 유저 리스트  $scope.rolegroupmember 
      $scope.getRoleGroupMemberList = function() {
        resources.getRoleGroupMember(items.id, function(data) {
          $scope.rolegroupmember = data;
          
          $scope.rolegroupmemberId = new Array(data.length);
          for ( var i = 0; i< data.length; i++) {
            $scope.rolegroupmemberId[i] = data[i].id;
          }
          $log.debug('$scope.rolegroupmember', $scope.rolegroupmemberId[0]);
        });
      };
      
      $scope.insertOk = function () {
        var param = { 
            roleGroupId : items.id,
            userId : $scope.rolegroupmemberId
        }; 
       
        //resources
        resources.mergeRoleGroupMember(param, function(data) {
          $log.debug(data);
          reload();
        });
        $modalInstance.dismiss('cancel');
        
//        $modalInstance.close();
      };
      
      
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      
      
      $scope.getRoleGroupMemberList();
    };
  }]);
});
