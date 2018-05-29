
/**
 * 
 * orderController
 * 
 */

define(['app', 
        'services/api/order/resources', 
        'services/api/allocation/resources',
        'services/api/goods/resources',
        'factories/sweet-alert', 
        'filters/filterLabel'], function(app){
  'use strict';
  app.controller('user/orderController',
      ['$scope', 
       'api/order/resources', 
       'api/allocation/resources', 
       'api/goods/resources', 
       'sweetAlert', '$modal', '$cookies', '$log', 'toastr',
        function ($scope, 
            $orderResources, $allocResources, $goodsResources, 
            sweetAlert, $modal, $cookies, $log, toastr) {
        $log.debug('user orderController');
          $scope.trucks = angular.fromJson($cookies.trucks);

          $scope.page = {
              normal : 1,
              share : 1,
              alloc : 1
          };

          $scope.normalCurrentPage = 1;
          $scope.shareCurrentPage = 1;
          $scope.allocCurrentPage = 1;
          
          $scope.normalPageChanged = function() {
            $scope.getOrderList('NORMAL');
          };
          $scope.sharePageChanged = function() {
            $scope.getOrderList('SHARE');
          };
          $scope.allocPageChanged = function() {
            $scope.getAllocatedOrderList();
          };

          $scope.getOrderList = function(type) {
            var param = {
                type : type,
                limit : 10,
                page : (type === 'NORMAL') ? $scope.page.normal - 1 : $scope.page.share - 1,
                qType : 'truck_user',
                status : 'ACTIVE',
                // 우선 하나의 주선소에 여러 트럭이 등록되어 있다고 가정한다.
                brokerId : $scope.trucks[0].brokerId,
                weight : $scope.trucks[0].weight
            };
            $orderResources.getOrders(param, function(data) {
              if (type === 'NORMAL') {
                $scope.normal_orders = data.contents;
                $scope.normal_orders_info = data.info;
              } else {
                $scope.share_orders = data.contents;
                $scope.share_orders_info = data.info;
              }
            });
          };
          
          $scope.getAllocatedOrderList = function() {
            var param = {
                limit : 10,
                page : $scope.allocCurrentPage - 1,
                allocator : $cookies.id,
                loadStart : new Date()
            };
            $allocResources.allocatedOrderList(param, function(data){
              $scope.allocated_orders = data.contents;
              $scope.allocated_orders_info = data.info;
              $scope.allocated_orders.forEach(function(item) {
                $goodsResources.getGoods({id:item.goods_id}, function(goodsData) {
                  item.goods = goodsData;
                });
              });
            });
          };
          
          $scope.refresh = function(type) {
            $scope.getOrderList(type);
            $scope.getAllocatedOrderList();
          };
          
          $scope.allocOrder = function(type, orderId) {
            var modalInstance = $modal.open({
              templateUrl: '/views/user/popup/allocOrder.html',
              controller: 'user/allocOrderController',
              size: 'md',
              scope: $scope,
              resolve: {
                reload : function() {
                  return $scope.refresh;
                },
                param : function() {
                  return {
                    type : type,
                    id : orderId
                  };
                }
              }
            });
          };

          $scope.showOrder = function(type, orderId) {
            var modalInstance = $modal.open({
              templateUrl: '/views/user/popup/showOrder.html',
              controller: 'user/showOrderController',
              size: 'lg',
              scope: $scope,
              resolve: {
                reload : function() {
                  return $scope.refresh;
                },
                param : function() {
                  return {
                    type : type,
                    id : orderId
                  };
                }
              }
            });
          };
          
          $scope.cancelAlloc = function(allocId) {
            sweetAlert.swal({
              title: "정말로 배차신청을 취소하시겠습니까?",
              text: "배차신청을 삭제하면 다시 복구할 수 없습니다.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "확인",
              cancelButtonText: "닫기",
              closeOnConfirm: false,
              closeOnCancel: true 
              },
              function (isConfirm) {
                if (isConfirm) {
                  $allocResources.cancelAllocatedOrder({id:allocId}, function(result){
                    $scope.getAllocatedOrderList();
                    $scope.getOrderList('NORMAL');
                    $scope.getOrderList('SHARE');
                    sweetAlert.swal("배차신청 취소완료", "배차신청이 취소되었습니다", "success");
                  });
                }
            });
          } ;
          
          $scope.getOrderList('NORMAL');
          $scope.getOrderList('SHARE');
          $scope.getAllocatedOrderList();
  }]);
});
