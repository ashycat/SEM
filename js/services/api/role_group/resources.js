/**
 * role_group_resources
 */

define(['app'], function(app){
  app.factory('api/role_group/resources', function(RestApi, $log) {
    var roleGroups = RestApi.all('rolegroups');
    var roleGroupsOne = RestApi.one('rolegroups');

    var groupRoles = RestApi.all('grouproles');
    var groupRolesOne = RestApi.one('grouproles');

    var roles = RestApi.all('roles');
    var rolesOne = RestApi.one('roles');

 
    return {
      //롤 그룹 조회 
      getRoleGroups : function(param, ok, fail) {
        roleGroupsOne.get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      //그룹 롤 조회 
      getGroupRoles : function(param, ok, fail) {
        groupRoles.one(''+param).get().then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      // 전체 롤의 리스트
      getRoleList : function(param, ok, fail) {
        rolesOne.get().then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      /*
       * 롤그룹 명 검색
       * rolegourps/name/:name
       */
      findByRoleGroupName : function(param, ok, fail) {
        roleGroupsOne.one("findByName").get(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },

      // 그룹의 롤 수정 put으로 수정 
      
      mergeRole : function(param, ok, fail) {
        roleGroupsOne.all(param.roleGroupId).one('roles').put(param).then(function(data) {
          ok(data);
        }, function(response) {
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });  
      },

      //롤 그룹 유저 삭제 
      deleteRoleGroupMember : function(param, ok, fail) {
        roleGroupsOne.all(param.roleGroupId).one('users').all(param.userId).remove(param).then(function(data){
          ok(data);
        }, function(response){
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      //롤 그룹 등록
      addRoleGroup : function(param, ok, fail) {
        roleGroups.post(param).then(function(data){
          ok(data);
        }, function(response){
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      //롤 그룹 멤버 리스트
      getRoleGroupMember : function(param, ok, fail) {
        roleGroupsOne.all(param).one('users').get().then(function(data) {
          ok(data);
        }, function(response){
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      },
      //롤 그룹 유저 삭제 삽입 -- put 
      mergeRoleGroupMember :function(param, ok, fail) {
        roleGroupsOne.all(param.roleGroupId).one('members').put(param).then(function(data) {
          ok(data);
        }, function(response){
          $log.debug('response', response);
          if (angular.isFunction(fail)) {
            fail(response);
          }
        });
      }
    };
  });
});