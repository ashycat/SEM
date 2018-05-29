
(function(){
  'use strict';

  var ie8 = /internet explorer/i.test(navigator.appName) && /MSIE 8/i.test(navigator.appVersion);
  var ie9 = /internet explorer/i.test(navigator.appName) && /MSIE 9\.0/i.test(navigator.appVersion);

  var deps = [
              'angular',
              'restangular',
              'lodash',
              'ng-grid',
              'angular-animate',
              'angular-ui-router',
              'angular-ui-utils',
              'angular-bootstrap',
              'angular-sanitize',
              'angular-ui-select',
              'angular-ui-map',
              'angular-flot',
              'angular-peity',
              'angular-ui-tree',
              'angular-ui-calendar',
              'fullcalendar',
              'chartjs',
              'angles',
              'modules/route-resolver',
              'sweetalert',
              'ngCookies',
              'LocalStorageModule',
              'checklist-model',
              'check-types',
              'angular-bootstrap-datetimepicker',
              'fcsa-number',
              'angular-toastr',
              'ngFileUpload',
              'ngMask',
              'datatables',
              'angular-datatables',
              'angular-xeditable',
              'angular-ui-sortable',
              'angular-footable',
              'ngRoute',
              ];

  var modules = [
                 'restangular',
                 'ngGrid',
                 'ngAnimate',
                 'ui.utils',
                 'ui.bootstrap',
                 'ui.router',
                 'ui.map',
                 'ui.select',
                 'ngSanitize',
                 'angles',
                 'angular-peity',
                 'ui.tree',
                 'ui.calendar',
                 'ui.router.resolver',
                 'ngCookies',
                 'LocalStorageModule',
                 'loadOnDemand',
                 'checklist-model',
                 'ui.bootstrap.datetimepicker',
                 'ui.utils',
                 'fcsa-number',
                 'toastr',
                 'ngFileUpload',
                 'ngMask',
                 'datatables',
                 'xeditable',                // Angular-xeditable
                 'ui.sortable',              // AngularJS ui-sortable
                 'ui.footable',               // FooTable
                 'ngRoute',
                 ];
  if (ie8 || ie9) {
    deps.push('modules/placeholder');
    modules.push('placeholder');
  }

  define(deps, function(angular) {
    var app = angular.module('app', modules); //;

    app.init = function() {
      angular.bootstrap(document, ['app']);
    };

    app.run(function($rootScope) {
      $rootScope.ie8 = ie8;
      var removeListener = $rootScope.$on('$viewContentLoaded', function(){
        angular.element('.splash').remove();
        (removeListener || angular.noop)();
      });

      if (ie8) {
        $rootScope.$on('$viewContentLoaded', function() {
          respond.update();
        });
      }
    });

    return app;
  });
})();
