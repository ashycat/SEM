
/**
 * 
 * dashboardController
 * 
 */

define(['app','services/api/notice/resources' ], function(app){
  'use strict';
  app.controller('user/dashboardController',
      ['$scope', 'api/notice/resources', '$modal', '$log',
        function ($scope, $noticeResources, $modal, $log) {
        $log.debug('user dashboardController');
          
        $scope.getNoticeList = function() {
          var param = {
              limit : 5,
              page : 0
          };
          
          $noticeResources.getNotices(param, function(result) {
            $scope.notices = result.contents;
            $scope.notices_info = result.info;
          });
        };
        
        $scope.showNotice = function(id) {
          $scope.$broadcast('show-notice', {id:id});
        };

        $scope.getNoticeList();

  }]);
});
