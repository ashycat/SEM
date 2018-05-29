
/**
 * 
 * showOrderController
 * 
 */

define(['app', 
        'services/api/order/resources', 
        'services/api/goods/resources', 
        'filters/filterLabel'], function(app){
  'use strict';
  app.controller('user/showOrderController',
      ['$scope', 'api/order/resources', 'api/goods/resources', 
       '$modal', 'sweetAlert', '$modalInstance', 'reload', 'param', '$cookies', '$log',
        function ($scope, $orderResources, $goodsResources, 
            $modal, sweetAlert, $modalInstance, $reload, $param, $cookies, $log) {

        $scope.getOrder = function(id) {
          $log.debug('id : ', id);
          $orderResources.getOrder({id:id}, function(result) {
            $scope.order = result;
            $log.debug('result ', result);
            $goodsResources.getGoods({type:'short', id:result.goods_id}, function(goodsResult) {
              $scope.goods = goodsResult;
              $log.debug('goods ', goodsResult);
            });
          });
        };
        
        $scope.allocOrder = function(orderId) {
          $modal.open({
            templateUrl: '/views/user/popup/allocOrder.html',
            controller: 'user/allocOrderController',
            size: 'md',
            scope: $scope,
            resolve: {
              reload : function() {
                return $scope.completeOrder;
              },
              param : function() {
                return {
                  type : $param.type,
                  id : $param.id
                };
              }
            }
          });
        };
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
        
        $scope.completeOrder = function() {
          $reload($param.type);
          $modalInstance.close();
        };
        
        $scope.getOrder($param.id);
  }]);
});
