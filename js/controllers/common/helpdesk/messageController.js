
define(['app', 'services/api/message/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('common/helpdesk/messageController', 
      ['$scope', 'api/message/resources', 'sweetAlert', '$modal', '$log', '$cookies', 
       function ($scope, $resources, sweetAlert, $modal, $log, $cookies) {

        $log.debug("messageController");
        $scope.messages = [];
      
        $scope.currentPage = 1;
        $scope.$watch("currentPage", function() {
          $scope.getMessageList();
        });
        
        $scope.getMessageList = function() {
          var param = {
              limit : 10,
              page : $scope.currentPage-1
          };
          
          $resources.getMessages(param, function(result) {
            $scope.messages = result.contents;
            $scope.messages_info = result.info;
            for (var i=0; i < $scope.messages.length; i++) {
              (function(index) {
                $resources.getReceiverByMessage({id:$scope.messages[index].id}, function(result) {
                  $scope.messages[index].receivers = result.contents;
                  $log.debug('$scope.message[%d] %o ', index, $scope.messages[index]);
                });
              })(i)
            }
          });
        };
      
        $scope.showMessage = function(id) {
          var modalInstance = $modal.open({
            templateUrl: '/views/common/helpdesk/popup/showMessage.html',
            controller: 'common/helpdesk/showMessageController',
            size: 'lg',
            scope: $scope,
            resolve: {
              param : function() {
                  return {id:id};
              },
              reload : function() {
                return $scope.getMessageList;
              }
            }
          });
        };
        
        $scope.addMessage = function() {
          var modalInstance = $modal.open({
            templateUrl: '/views/common/helpdesk/popup/addMessage.html',
            controller: 'common/helpdesk/addMessageController',
            size: 'lg',
            scope: $scope,
            resolve: {
              reload : function() {
                return $scope.getMessageList;
              }
            }
          });
        };
        
        $scope.showChangeButton = function() {
          // TODO : user와 role을 보고 적용해야 한다. 
          return !!$cookies.id;
        };

//        $scope.getMessageList();
    }]);
});