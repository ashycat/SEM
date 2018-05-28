/**
 * 
 * role_groupController
 * 
 */

define(['app', 'services/api/role_group/resources', 'services/api/user/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('admin/role_group/listController', 
      ['$scope', 'api/role_group/resources','api/user/resources', 'sweetAlert', '$modal', '$log',   
       function ($scope, resources, userresources, sweetAlert, $modal, $log, $location) {
        $log.debug('admin/role_group/listController!!!!');
        var cellTemplate='<div class="ngCellText"  data-ng-model="row">' +
                       '<button class="btn btn-xs btn-danger" data-ng-click="modifyRoles( row,$event)">권한수정</button></div>';
    
        var cellTemplate1='<div class="ngCellText"  data-ng-model="row">' +
                       '<button class="btn btn-xs btn-danger" data-ng-click="modifyUsers( row,$event)">사용자편집</button></div>';
    
        $scope.gridOptions = {
            data: 'roleGroupData',
            selectedItems: $scope.mySelections,
            multiSelect: false,
            columnDefs: [
              {field:'id', displayName: '번호'},
              {field:'name', displayName: '그룹명 '},
              {field:'user_name', displayName: '권한 ', cellTemplate:cellTemplate},
              {field:'password', displayName: '사용자 ', cellTemplate:cellTemplate1},
            ],
            rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell [[col.cellClass]]"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>'
        };
    
        $scope.roleGroupList = function() {
          $log.debug('rolegroup');
          resources.getRoleGroups({}, function(result) {
            $scope.roleGroupData = result;
            $log.debug('result is ',result[0].id);
          });
        };
        
        $scope.getRoleList = function() {
          resources.getRoleList({}, function(data){
            $scope.roles = data;
            $log.debug('rolelist is ', data);
            return data;
          });
        };
      $scope.modifyRoles = function (row) {
        var modalInstance = $modal.open({
          templateUrl: '/views/admin/role_group/grouprole_list.html',
          controller: 'admin/role_group/grouprole_listController',
          size: 'lg',
          scope: $scope,
          resolve: {   
            items: function () {
              return row.entity;
            }, 
            reload : function() {
              return $scope.roleGroupList;
            },
            getRoles : function() {
              return $scope.getRoleList;
            }
          }
        });    
      };
    
      
      $scope.modifyUsers = function (row) {
        
        var modalInstance = $modal.open({
          templateUrl: '/views/admin/role_group/showGroupUserList.html',
          controller: 'admin/role_group/showGroupUserController',
          resolve: {
            items: function () {
              return row.entity;
            }, 
            reload : function() {
              return $scope.getGroupUserList;
            },
          }
        });    
      };
      
     
      $scope.addRoleGroup = function () {
        $log.debug('addroleGroup()');
        var modalInstance = $modal.open({
          templateUrl: 'views/admin/role_group/addRoleGroup.html',
          controller: 'admin/role_group/addRoleGroupController',
          resolve: {
            reload : function() {
              return $scope.roleGroupList;
            }
          }
        });
      };
      
      $scope.roleGroupList();
      $scope.getRoleList();
  }]);
});
