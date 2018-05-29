
define(['app', 'services/api/trucktype/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('common/addTrucktypeController', 
      ['$scope', 'api/trucktype/resources', 'sweetAlert', '$modalInstance', 'reload', '$cookies', '$log',
       function ($scope, resources, userResources, sweetAlert, $modalInstance, reload, $cookies, $log) {
        $log.debug("addTrucktypeController");

        $scope.name_kr = "";
        $scope.name_en = "";
        $scope.weight = 0.0;
        
        $scope.selectedReceiver = function() {
          $log.debug("####", $scope.id);
        };
        
        $scope.searchUser = function() {
          $scope.receiver_id = 0;
          $log.debug($scope.receiver_name);
          if (!$scope.name_kr || $scope.name_kr.length < 2) {
            alert('사용자이름을 입력하지 않았거나 너무 짧은 이름을 입력했습니다.');
            return;
          }
          var param = {
              username : $scope.receiver_name
          };
          userResources.findByUsername(param, function(result) {
            $scope.search_users = result;
          });
        };
        
        $scope.canSave = function() {
          $log.debug('>>', $scope.receiver);
          $log.debug('>>', $scope.receiver_id);
          if ($scope.subject === '') {
            return false;
          }
          if($scope.content === '') {
            return false;
          }
          if ($scope.receiver === 'one' && $scope.receiver_id === 0) {
            return false;
          }
          return true;
        };
        
        $scope.save = function() {
          if(angular.isUndefined($cookies.id)) {
            reload();
            $scope.$close();
          } else {
            var param = {
                 subject : $scope.subject,
                 content : $scope.content,
//                 receiver_id : $scope.receiver_id
            };
            $log.debug('param ', param);
            resources.addMessage(param, function(result) {
              $log.debug(result);
              var receiverParam = {
                  message_id : result.contents, 
                  receiver_id : $scope.receiver_id
              };
              resources.addReceiver(receiverParam, function(reResult) {
                reload();
                $scope.$close();
              });
            });
          }
        };
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

    }]);
});