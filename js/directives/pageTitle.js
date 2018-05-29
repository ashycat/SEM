define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.directive('pageTitle',function ($rootScope, $timeout) {
    return {
      link: function(scope, element) {
        var listener = function(event, toState, toParams, fromState, fromParams) {
          // Default title
          var title = '화물프로';
          // Create your own title pattern
          if (toState.data && toState.data.pageTitle) {
            title = '화물프로 | ' + toState.data.pageTitle;
          }
          $timeout(function() {
              element.text(title);
          });
        };
        $rootScope.$on('$stateChangeStart', listener);
      }
    };
  });
});