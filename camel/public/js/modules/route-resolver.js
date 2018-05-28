
define(['angular', 'modules/ondemand', 'modules/resolver'], function() {
  'use strict';
  var services = angular.module('ui.router.resolver', ['loadOnDemand','resolver']);
  
  services.provider('$routeResolver', function() {
    this.$get = function() {
      return this;
    };
    
    this.routeConfig = function() {
      var viewsDirectory = '/views/';
      var controllersDirectory = 'controllers/';
      
      var setDirectories = function(viewsDir, controllersDir) {
        viewDirectory = viewsDir;
        controllersDirectory = controllersDir;
      };
      
      var getViewsDirectory = function() {
        return viewsDirectory;
      };
      var getControllersDirectory = function() {
        return controllersDirectory;
      };
      
      return {
        setDirectories: setDirectories,
        getViewsDirectory: getViewsDirectory,
        getControllersDirectory: getControllersDirectory
      };
    }();
    
    this.resolve = function(config) {
      var r = function(url, name, dependencies, modules) {
        var path = name.replace(/\./g, '/');
        var routeDef = {};
        routeDef.url = url;
        routeDef.templateUrl = config.getViewsDirectory() + path + '.html';
        routeDef.controller = path + 'Controller';
        routeDef.resolve = {
          load: function($q, $rootScope, $module, $resolver, $log) {
            var deferred = $q.defer();
            $module.register(angular.isArray(modules) ? modules : []).then(function() {
              var deps;
              if (angular.isArray(dependencies)) {
                deps = dependencies.slice(0);
              } else {
                deps = [];
              }
              deps.push(config.getControllersDirectory() + routeDef.controller);
              $resolver.require(deps).then(function() {
                deferred.resolve();
              });
            });
            return deferred.promise;
          }
        };
        return routeDef;
      };

      return r;
    }(this.routeConfig);
    
  });
});