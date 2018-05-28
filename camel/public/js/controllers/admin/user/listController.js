
/**
 * 
 * userController
 * 
 */

define(['app', 'services/api/user/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('admin/user/listController', 
      ['$scope', 'api/user/resources', 'sweetAlert', '$modal', '$log',   
       function ($scope, resources, sweetAlert, $modal, $log, $location) {
        $log.debug('admin/user/listController!!!!');
        var cellTemplate='<div class="ngCellText"  data-ng-model="row">' +
                       '<button class="btn btn-xs btn-danger" data-ng-click="deleteUser(row,$event)">DELETE</button></div>';
    
        $scope.gridOptions = {
            data: 'myData',
            selectedItems: $scope.mySelections,
            multiSelect: false,
            columnDefs: [
              {field:'id', displayName: '번호'},
              {field:'user_id', displayName: '아이디'},
              {field:'user_name', displayName: '이름'},
              {field:'password', displayName: '비밀번호'},
              {field:'role', displayName: '권한'},
              {field:'',cellTemplate:cellTemplate}
            ],
            rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell [[col.cellClass]]"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>'
        };
      
        $scope.gridOptionsTwo = {
            data: 'exampleData',
            showGroupPanel: true,
            jqueryUIDraggable: true
        };
        
        $scope.userList = function(){
          resources.getUsers({}, function(result) {
            $scope.myData = result;
          });
        };
      
        $scope.addUser = function () {
          var modalInstance = $modal.open({
            templateUrl: 'views/admin/user/add_user.html',
            controller: AddUserCtrl,
            resolve: {
              reload : function() {
                return $scope.userList;
              }
            }
          });
        };
      
        var AddUserCtrl = function ($scope, $modalInstance, reload) {
          $scope.role = 'user';
          $scope.insertOk = function () {
            var param = { 
              user_id : $scope.user_id, 
              user_name : $scope.user_name,
              password : $scope.password,
              role : $scope.role
            };
            resources.addUser(param, function() {
              reload();
            });
            $modalInstance.close();
          };
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        };
      
        $scope.onDblClickRow = function(row) {
          $scope.myrow=row.entity;
          var modalInstance = $modal.open({
            templateUrl: 'views/admin/user/modify_user.html',
            controller: ModifyUserCtrl,
            resolve: {
              items: function () {
                return row.entity;
              }, 
              reload : function() {
                return $scope.userList;
              }
            }
          });
        };
      
        var ModifyUserCtrl = function ($scope, $modalInstance, items, reload, $log) {
            $scope.items = items;
            $scope.update = function () {
              var param = {
                id : $scope.items.id,
                user_name : $scope.items.user_name,
                password : $scope.items.password,
                user_id : $scope.items.user_id,
                role : $scope.items.role
              };
              resources.modifyUser(param, function() {
                reload();
              });
              $modalInstance.close();
            };
            $scope.delete = function () {
              var param = {
                id : $scope.items.id
              };
              resources.deleteUser(param, function() {
                reload();
              });
              $modalInstance.close();
            };
            $scope.cancel = function () {
              $modalInstance.close();
            };
            
        };
        
        $scope.deleteUser = function (row) {
          sweetAlert.swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel plx!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function (isConfirm) {
              if (isConfirm) {
                var param = {id : row.entity.id};
                resources.deleteUser(param, function() {
                  $scope.userList();
                  sweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
                }, function(err){
                  $log.debug(err);
                  alert('err', err);
                });
              } else {
                sweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
              }
          });
        };
      
        $scope.userList();
  }]);
});
