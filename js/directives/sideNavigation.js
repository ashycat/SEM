define(['angular', 'app', 'metisMenu'], function(angular, app) {
  'use strict';
  app.directive('sideNavigation', function ($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        // Call the metsiMenu plugin and plug it to sidebar navigation
        element.metisMenu();
        
        var menuElement = $('#side-menu a:not([href$="\\#"])');
        menuElement.click(function(){
            if ($(window).width() < 769) {
                $("body").toggleClass("show-sidebar");
            }
        });

      }
    };
  });
});