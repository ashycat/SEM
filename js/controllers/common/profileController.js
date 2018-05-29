
/**
 * 
 * profileController
 * 
 */

define( [ 'app', 'services/api/user/resources'], function(app) {
  'use strict';
  app.controller('common/profileController',
      ['$scope', 'api/user/resources', '$cookies', '$log',
       function($scope, $userResources, $cookies, $log) {
        $log.debug('profileController');
  }]);
});