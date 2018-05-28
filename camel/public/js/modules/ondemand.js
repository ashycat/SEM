
define(['angular', 'modules/resolver'], function(angular) {
  'use strict';
  var isUndefined = angular.isUndefined;
  var forEach = angular.forEach;
  
  var ie8 = /internet explorer/i.test(navigator.appName) && /MSIE 8/i.test(navigator.appVersion);
  
  var loaded = [];
  
  var isLoaded = function(name) {
      return loaded.indexOf(name) >= 0;
  };
  function _register($injector, providers, name, $log) {
      if (isLoaded(name)) {
          return;
      }
//    if ($injector.has(name)) {
//      return;
//    }
      loaded.push(name);
      $log.info('Initializing module: ' + name);
      var moduleFn = angular.module(name);
      try {
        var invokeQueue = moduleFn._invokeQueue;
        for (var i = 0; i < invokeQueue.length; i++) {
          var invokeArgs = invokeQueue[i];
          var provider;
          if (providers.hasOwnProperty(invokeArgs[0])) {
            provider = providers[invokeArgs[0]];
          } else {
            return $log.error('unsupported provider ' + invokeArgs[0]);
          }
          provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
        }
      } catch (e) {
        if (e.message) {
          e.message += ' from ' + name;
        }
        $log.error(e.message);
        throw e;
      }
      forEach(moduleFn._runBlocks, function(fn) {
        $injector.invoke(fn);
      });
  }
  
  function compileChild(scope, element, $compile, $log) {
    $compile(element.contents())(scope.$new());
  }
  
  angular.module('loadOnDemand', ['resolver'])
  .provider('$loadOnDemand', function($controllerProvider, $compileProvider, $filterProvider, $provide) {
    this.$get = function() {
      return this;
    };
    this.modules = {};
    this.providers = {
        $controllerProvider: $controllerProvider,
        $compileProvider: $compileProvider,
        $filterProvider: $filterProvider,
        $provide: $provide
    };
    this.setModules = function(m) {
      this.modules = m;
    };
  })
  .factory('$module', function($q, $loadOnDemand, $injector, $resolver, $log) {
      var getModules = function(names) {
          var ret = {names: [], scripts: [], inits: []};
          angular.forEach(names, function(name) {
              var module = $loadOnDemand.modules[name];
              if (!angular.isObject(module)) {
                  $log.error('Unknown module: ' + name);
                  return;
              }
              var moduleName = (module.name || name);
              if (ie8 && angular.isDefined(module.ie8) && !angular.ie8) {
                  $log.error('Module[' + moduleName + '] not support IE8');
                  return;
              }
              if (!isLoaded(moduleName)) {
                  ret.names.push(moduleName);
                  angular.forEach(module.script, function(script) {
                      ret.scripts.push(script);
                  });
                  if (angular.isFunction(module.init)) {
                      ret.inits.push(module.init);
                  }
              }
          });
          return ret;
      };
      return {
          register: function(names) {
              var modules = getModules(angular.isArray(names) ? names: [names]);
              var deferred = $q.defer();
              if (modules.names.length === 0) {
                  deferred.resolve();
              } else {
                    var providers = $loadOnDemand.providers;
                    $resolver.require(modules.scripts)
                    .then(function() {
                        angular.forEach(modules.inits, function(init) {
                            init();
                        });
                        angular.forEach(modules.names, function(name) {
                            _register($injector, providers, name, $log);
                        });
                        deferred.resolve();
                    });
                }
              return deferred.promise;
          }
      };
  });
});