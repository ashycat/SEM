define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.directive('minimalizaMenu', function ($rootScope) {
    return {
      restrict: 'EA',
      template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
      controller: function ($scope, $element) {
        $scope.minimalize = function () {
        if ($(window).width() < 769) {
                $("body").toggleClass("show-sidebar");
            } else {
                $("body").toggleClass("hide-sidebar");
            }
        };
      }
    };
  });
});