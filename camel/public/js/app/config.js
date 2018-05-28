

define(['angular', 
        'app',
        'app/' + app_config.type + '-routes',
        'services/menuloader',
        'interceptors/http',
        'controllers/common', 
        'services/restapi',
        'directives/common',
        'modules/route-resolver'
        ], 
        function(angular, app, routeConfig, menuloader) { 
  'use strict';
  
  var isUndefined = angular.isUndefined;
  var isDefined = angular.isDefined;
  var forEach = angular.forEach;
  
  app.config(function($loadOnDemandProvider) {
    $loadOnDemandProvider.setModules({
//      d3: {
//          script: ['angular-nvd3'],
//          name: 'nvd3',
//        init: function() {
//          window.nv.dev = false;
//        },
//        ie8: false
//      },
//      'chartjs': {
//          script: ['modules/chartjs'],
//          ie8: false
//      },
//      'chart.pie': {
//          script: ['modules/chart/pie']
//      },
//      'chart.donut': {
//          script: ['modules/chart/donut']
//      },
//      'chart.bar': {
//          script: ['modules/chart/bar']
//      },
//      'chart.general': {
//          script: ['modules/chart/general']
//      },
//      elastic: {
//          name: 'monospaced.elastic',
//          script: ['modules/elastic']
//      },
//      'infinite-scroll': {
//          script: ['ng-infinite-scroll']
//      },
//      'ckeditor': {
//          script: ['angular-ckeditor'],
//          name: 'ckeditor'
//      },
//      bootbox: {
//          script: ['ngBootbox'],
//          name: 'ngBootbox'
//      }
    });
  });
  
  app.config(function($logProvider) {
    $logProvider.debugEnabled = true;
  });
  
  //replacement for lazy evaluation
  app.config(function($controllerProvider, $compileProvider, $filterProvider, $provide) {
    app.controller= $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
  });

  app.config(function($locationProvider, $provide) {
    $locationProvider.html5Mode(false).hashPrefix('!');
  });

  // configures angular-ui-router
  app.config(function($stateProvider, $routeResolverProvider, $urlRouterProvider, $interpolateProvider ) {

    $interpolateProvider.startSymbol('[[').endSymbol(']]');

    var resolve = $routeResolverProvider.resolve;
    var registerUrl = function(items) {
      forEach(items, function(item) {
        if (item.url && item.path) {
          $stateProvider.state(item.path,
                  resolve(item.url, item.path, item.deps, item.modules));
        }
        if (angular.isArray(item.sub)) {
          registerUrl(item.sub);
        }
      });
    };
    menuloader(registerUrl);
//    $urlRouterProvider.otherwise("/dashboard");

    if (!isUndefined(routeConfig)) {
      if (!isUndefined(routeConfig.redirect)) {
        forEach(routeConfig.redirect, function(to, from) {
          $urlRouterProvider.when(from, to);
        });
      }
      if (!isUndefined(routeConfig.defaultPath)) {
        $urlRouterProvider.otherwise(routeConfig.defaultPath);
      }
    }
    
  });
});


