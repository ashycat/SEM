define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.directive('touchSpin', function (){
    return {
      restrict: 'A',
      scope: {
          spinOptions: '=',
      },
      link: function (scope, element, attrs) {
          scope.$watch(scope.spinOptions, function(){
              render();
          });
          var render = function () {
              $(element).TouchSpin(scope.spinOptions);
          };
      }
    };
  });
});