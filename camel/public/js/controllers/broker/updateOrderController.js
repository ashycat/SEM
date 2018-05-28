
/**
 * 
 * updateOrderController
 * 
 */

define(['app', 
        'services/api/order/resources', 
        'services/api/google/resources',
        'services/api/consigner/resources',
        'services/api/location/resources',
        'services/api/goods/resources'
        ], function(app){
  'use strict';
  app.controller('broker/updateOrderController',
      ['$scope', 
       'api/order/resources', 'api/google/resources', 
       'api/consigner/resources', 'api/location/resources', 'api/goods/resources',  
       '$modalInstance', 'reload', 'param', '$log',  
        function ($scope, 
            $orderResources, $google, $consignerResources, 
            $locationResources, $goodsResources, $modalInstance, $reload, $param, $log) {
        $log.debug('broker updateOrderController', $param);
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
  }]);
});
