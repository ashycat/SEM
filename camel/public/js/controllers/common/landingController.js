define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.controller('common/landingController',
      ['$scope', '$location', '$log',
       function($scope, $location,  $log) {
        
        $log.debug('landingController');
        $scope.currentId = 'page-top';

        $scope.scrollTo = function(id, event) {
          $scope.currentId = id;
          $location.hash(id);
          var $target = angular.element(document.querySelector( '#' + id ));
          $("body").animate({scrollTop: $target.offset().top - 50}, 500);
        };
        
        $scope.activeClass = function(id) {
          if ($scope.currentId === id) {
            return 'active';
          } else {
            return '';
          }
        };
  }]);
});