
"use strict";
define(['app', 'services/api/mailtemplate/resources'], function(app){
  app.controller('common/mail/updateMailtemplateController', 
      ['$scope', 'api/mailtemplate/resources', '$cookies', '$modal', 'param', 'reload',
       function ($scope, $resources, $cookies, $modal, param, reload) {
        
        console.log('update Email Templates');
        
        $scope.getMailtemplate = function(id) {
          console.log(id);
          $scope.templateId = id;
          $resources.getMailtemplate({id:id}, function(result) {
            $scope.subject = result.contents[0].subject;
            $scope.content = result.contents[0].content;
          });
        };
        
        $scope.save = function() {
          var params ={
              id : param.id,
              subject : $scope.subject,
              content : $scope.content,
              userId : $cookies.id
          };
          $resources.modifyMailtemplate(params, function(result){
            reload();
            $scope.$close();
          });
        };
        
        $scope.cancel = function(){
          reload();
          $scope.$close();
        };
        
        $scope.getMailtemplate(param.id);
    }]);
});