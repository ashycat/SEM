
define(['app'], function(app){
  'use strict';
  app.controller('common/calendar/showEventController', 
      ['$scope', '$modalInstance', 'param', '$log',
       function ($scope, $modalInstance, $param, $log) {
        $log.debug("showEventController", $param);

        $scope.title = $param.event.title;
        $scope.start = $param.event.start.format('');
        $scope.end = '';
        if ($param.event.end) {
          $scope.end = $param.event.end.format();
        } else {
          $scope.end = $scope.start;
        }
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

    }]);
});