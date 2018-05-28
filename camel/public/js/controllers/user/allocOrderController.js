
/**
 * 
 * showOrderController
 * 
 */

define(['app', 'services/api/order/resources', 'services/api/truck/resources'], function(app){
  'use strict';
  app.controller('user/allocOrderController',
      ['$scope', 'api/order/resources', 'api/truck/resources', 
       '$modal', 'sweetAlert', '$modalInstance', 'reload', 'param', '$cookies', '$log',
        function ($scope, $orderResources, $truckResources,  
            $modal, sweetAlert, $modalInstance, $reload, $param, $cookies, $log) {

        $log.debug($param);
        
        $scope.param = {
            type : $param.type,
            id : $param.id
        };
        
        $scope.getTrucks = function() {
          $truckResources.getTrucksByUser({}, function(data) {
            $scope.trucks = data;
            $scope.param.truckId = data[0].id;
          });
        };
        
        $scope.allocate = function() {
          $log.debug($scope.param.truckId);
          $orderResources.allocateOrder($scope.param, function(data) {
            $reload($param.type);
            $modalInstance.close();
          }, function(response) {
            $scope.code = response.data.code;
            $scope.message = response.data.message;
            $log.debug(response);
          });
        };
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
        
        $scope.getTrucks();
  }]);
});
