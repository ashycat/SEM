
define(['app', 'services/api/mailtemplate/resources', 'services/api/role_group/resources'], function(app){
  'use strict';
  app.controller('common/mail/addMailtemplateController', 
      ['$scope', 'api/mailtemplate/resources', 'api/role_group/resources', '$cookies', '$log', 'reload',    
       function ($scope, mailResources, roleGroupResources, $cookies, $log, reload ) {
        $log.debug("addMailtemplateController", $cookies.userName);
        
        $scope.save = function() {
          console.log('click ok', $scope.subject , $scope.content, $cookies.userId);
          var param = {
              subject : $scope.subject,
              content : $scope.content,
              id : $cookies.id 
          };
          mailResources.create(param, function(result){
            console.log('create result', result);
            reload();
            $scope.$close();
          });
        };
        
        $scope.cancel = function() {
          $scope.$close();
        };
    }]);
});