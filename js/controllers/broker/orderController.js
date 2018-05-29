
/**
 * 
 * orderController
 * 
 */

define(['app', 
        'services/api/order/resources', 
        'filters/filterLabel'], function(app){
  'use strict';
  app.controller('broker/orderController',
      ['$scope', 'api/order/resources', '$modal', '$log', 'toastr',
        function ($scope, $orderResources, $modal, $log, toastr) {
          $log.debug('broker orderController');
          $scope.currentOrderPage = 1;

          $scope.pageChanged = function() {
            $scope.getOrderList();
          };
          
          $scope.addOrder = function() {
            var modalInstance = $modal.open({
              templateUrl: '/views/broker/popup/addOrder.html',
              controller: 'broker/addOrderController',
              size: 'lg',
              scope: $scope,
              resolve: {
                reload : function() {
                  return $scope.getOrderList;
                }
              }
            });
          };
          
          $scope.updateOrder = function(index) {
            var modalInstance = $modal.open({
              templateUrl: '/views/broker/popup/updateOrder.html',
              controller: 'broker/updateOrderController',
              size: 'lg',
              scope: $scope,
              resolve: {
                reload : function() {
                  return $scope.getOrderList;
                }, 
                param : function() {
                  return {
                    order : $scope.orders[index]
                  };
                }
              }
            });
          };

          $scope.showOrder = function(id) {
            var modalInstance = $modal.open({
              templateUrl: '/views/broker/popup/showOrder.html',
              controller: 'broker/showOrderController',
              size: 'lg',
              scope: $scope,
              resolve: {
                reload : function() {
                  return $scope.getOrderList;
                }, 
                param : function() {
                  return {
                    id : id
                  };
                }
              }
            });
          };

          $scope.orderStatus = function(index) {
            var order = $scope.orders[index];
            if (order.status === 'CANCEL') {
              return '취소';
            } else if (order.status === 'COMPLETE') {
              return '완료';
            }
            if ($scope.orders[index].allocated) {
              return "배차";
            } else {
              return "미배차";
            }
          };
          
          $scope.getOrderList = function() {
            var param = {
                limit : 10,
                page : $scope.currentOrderPage - 1,
                qType : 'broker'
            };
            $orderResources.getOrders(param, function(result) {
              $scope.orders = result.contents;
              $scope.orders_info = result.info;
              $scope.orders.forEach(function(item) {
                if (item.is_alloc) {
                  $orderResources.getOfferByOrderId({id:item.id}, function(data){
                    item.offer = data;
                  });
                }
              });
              
            });
          };

          $scope.getOrderList();
  }]);
});
