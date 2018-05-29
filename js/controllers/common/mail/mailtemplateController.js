
//define(['app', 'services/api/emailtemplates/resources', 'factories/sweet-alert'], function(app){
define(['app', 'services/api/mailtemplate/resources'], function(app){
  'use strict';
  app.controller('common/mail/mailtemplateController', 
      ['$scope', 'api/mailtemplate/resources', '$modal',
       function ($scope, $resources, $modal) {
        
      $scope.showMailtemplateList = function(){
        var param = {
          limit : 10,
//          page : $scope.currentPage-1
          page : 0
        };
        $resources.getMailtemplates(param, function(result) {
          $scope.mailtemplates = result.contents;
          $scope.mailtemplates_info = result.info;
          for (var i=0; i < $scope.mailtemplates.length; i++) {
            (function(index) {
              $resources.getReceiverByMailtemplate({id:$scope.mailtemplates[index].id}, function(result) {
                $scope.mailtemplates[index].receivers = result.contents;
              });
            })(i);
          }
        });
      };
      
      $scope.updateMailTemplateContent = function(id) {
        var modalInstance = $modal.open({
          templateUrl: '/views/common/mail/popup/updateMailtemplate.html',
          controller: 'common/mail/updateMailtemplateController',
          size: 'lg',
          scope: $scope,
          resolve: {
            param : function() {
                return {id:id};
            },
            reload : function() {
              return $scope.showMailtemplateList;
            }
          }
        });
      };

      $scope.manageReceiverGroup = function(id) {
        var modalInstance = $modal.open({
          templateUrl: '/views/common/mail/popup/manageReceiverGroup.html',
          controller: 'common/mail/manageReceiverGroupController',
          size: 'lg',
          scope: $scope,
          resolve: {
            param : function() {
              return {id:id};
            },
            reload : function() {
              return $scope.showMailtemplateList;
            }
          }
        });
      };
      
      $scope.addMailtemplate = function() {
        var modalInstance = $modal.open({
          templateUrl: '/views/common/mail/popup/addMailtemplate.html',
          controller: 'common/mail/addMailtemplateController',
          size: 'lg',
          scope: $scope,
          resolve: {
            reload : function() {
              return $scope.showMailtemplateList;
            }
          }
        });
      };
      
      
      $scope.showMailtemplateList();
    }]);
});