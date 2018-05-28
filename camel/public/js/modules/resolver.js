define(['angular'], function() {
  'use strict';
  var isUndefined = angular.isUndefined;
  var isArray = angular.isArray;
  
  return angular.module('resolver', [])
  .service('$resolver', function($q, $rootScope) {
    this.require = function(deps) {
      if (isUndefined(deps)) {
        deps = [];
      }
      if (!isArray(deps)) {
        deps = [deps];
      }
      var defer = $q.defer();
      if (deps.length > 0) {
        require(deps, function() {
          $rootScope.$apply();
          defer.resolve();
        });
      } else {
        defer.resolve();
      }
      return defer.promise;
    };
  });
});