
/**
 * 
 * addOrderController
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
  app.controller('broker/showOrderController',
      ['$scope', 
       'api/order/resources', 
       'api/google/resources', 
       'api/consigner/resources', 
       'api/location/resources', 
       'api/goods/resources',  
       '$modalInstance', 'reload', '$log',  
        function ($scope, $orderResources, $google, $consignerResources, 
            $locationResources, $goodsResources, $modalInstance, $reload, $log) {
          $log.debug('broker showOrderController');

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

  }]);
});
