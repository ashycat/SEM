
/**
 *
 * dashboardController
 *
 */

define(['app'/*,'services/api/notice/resources' ,'services/api/message/resources'*/ ], function(app){
  'use strict';
  app.controller('admin/dashboardController',
      ['$scope',/*, 'api/notice/resources', 'api/message/resources'*/ '$modal', '$log',
        function ($scope/*, $noticeResources, $messageResources*/, $modal, $log) {
          $log.debug('admin dashboardController');
            console.log("dashboardController");
          var param = {
              limit : 10,
              page : 0
          };

          $scope.getNoticeList = function() {
            // $noticeResources.getNotices(param, function(result) {
              // $scope.notices = result.contents;
              // $scope.notices_info = result.info;
            // });
                $scope.notices = [{"id" : "ashycat","subject" : "ashycat11"}];
          };

          // $scope.getMessageList = function() {
          //   $messageResources.getMessages(param, function(result) {
          //     $scope.messages = result.contents;
          //     $scope.messages_info = result.info;
          //   });
          // };

          $scope.getNoticeList();
          // $scope.getMessageList();
  }]);
});
