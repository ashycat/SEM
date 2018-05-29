
//define(['app', 'services/api/emailtemplates/resources', 'factories/sweet-alert'], function(app){
define(['app', 'services/api/mailtemplate/resources', 'services/api/role_group/resources'], function(app){
  'use strict';
  app.controller('common/mail/manageReceiverGroupController', 
      ['$scope', 'api/mailtemplate/resources', 'api/role_group/resources', '$cookies', '$modal', 'param', 'reload',
       function ($scope, $mailtemplateResources, $roleGroupResources, $cookies, $modal, param, reload) {
        
        console.log('manager Receiver Group Templates');
//        $scope.receiverGroup =[{id : 1, name:'admin'},{id : 2, name:'broker'},{id:3, name:'min'}];
//        $scope.receiverGroupId=[1,2];
        
        $scope.getRoleGroupList = function(){
          var param = {};
          $roleGroupResources.getRoleGroups(param, function(result){
            $scope.receiverGroup = result;
          });
        };
        
        $scope.getReceiverGroup = function(){
          console.log(param.id);
          $scope.receiverGroupId=[];
          $mailtemplateResources.getReceiverByMailtemplate({id : param.id}, function(result){
            for (var i=0; i < result.contents.length; i++) {
              (function(index) {
                $scope.receiverGroupId.push(result.contents[index].id);
              })(i)
            }
          });
        };
        
        $scope.save = function(){
          var params ={
              id : param.id,
              receiverGroups : $scope.receiverGroupId
          };
          $mailtemplateResources.modifyReceiverGroup(params, function(result){
            reload();
            $scope.$close();
          });
        };
        
        $scope.getReceiverGroup();
        $scope.getRoleGroupList();
    }]);
});