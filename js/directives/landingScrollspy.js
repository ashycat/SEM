define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.directive('landingScrollspy', function (){
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.scrollspy({
          target: '.navbar-fixed-top',
          offset: 80
        });
      }
    };
  });
});