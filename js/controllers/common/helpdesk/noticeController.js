
define(['app', 'services/api/notice/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('common/helpdesk/noticeController', 
      ['$scope', 'api/notice/resources', 'sweetAlert', '$modal', '$log', '$cookies',    
       function ($scope, resources, sweetAlert, $modal, $log, $cookies) {

        $log.debug("noticeController");
        $scope.notices = [];
        $scope.currentPage = 1;
        
        $scope.$watch("currentPage", function() {
          $scope.getNoticeList();
        });
        
        $scope.getNoticeList = function() {
          var param = {
              limit : 10,
              page : $scope.currentPage-1
          };
          
          resources.getNotices(param, function(result) {
            $scope.notices = result.contents;
            $scope.notices_info = result.info;
          });
        };
      
        $scope.showContent = function(id) {
          var modalInstance = $modal.open({
            templateUrl: '/views/common/helpdesk/popup/showNotice.html',
            controller: 'common/helpdesk/showNoticeController',
            size: 'lg',
            scope: $scope,
            resolve: {
              param : function() {
                  return {id:id};
              },
              reload : function() {
                return $scope.getNoticeList;
              }
            }
          });
        };
        
        $scope.addNotice = function() {
          var modalInstance = $modal.open({
            templateUrl: '/views/common/helpdesk/popup/addNotice.html',
            controller: 'common/helpdesk/addNoticeController',
            size: 'lg',
            scope: $scope,
            resolve: {
              reload : function() {
                return $scope.getNoticeList;
              }
            }
          });
        };
        
        $scope.showChangeButton = function() {
          // TODO : user와 role을 보고 적용해야 한다. 
          return !!$cookies.id;
        };
        
    }]);
});