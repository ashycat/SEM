
/**
 * 
 * dashboardController
 * 
 */

define(['app',
        'services/api/notice/resources', 
        'services/api/message/resources', 
        'services/api/order/resources'], function(app){
  'use strict';
  app.controller('broker/dashboardController',
      ['$scope', 
       'api/notice/resources', 'api/message/resources', 'api/order/resources', '$modal', '$log',
        function ($scope, $noticeResources, $messageResources, $orderResources, $modal, $log) {
          $log.debug('broker dashboardController');

          var param = {
              limit : 5,
              page : 0
          };
          
          $scope.getNoticeList = function() {
            $noticeResources.getNotices(param, function(result) {
              $scope.notices = result.contents;
              $scope.notices_info = result.info;
            });
          };

          $scope.getMessageList = function() {
            $messageResources.getMessages(param, function(result) {
              $scope.messages = result.contents;
              $scope.messages_info = result.info;
            });
          };

          $scope.getOrderList = function() {
            $orderResources.getOrders(param, function(result) {
              $scope.orders = result.contents;
              $scope.orders_info = result.info;
            });
          };

          $scope.showMessage = function(id) {
            $scope.$broadcast('show-message', {id:id});
          };

          $scope.showNotice = function(id) {
            $scope.$broadcast('show-notice', {id:id});
          };

          $scope.getNoticeList();
          $scope.getMessageList();
          $scope.getOrderList();
  }]);
});
