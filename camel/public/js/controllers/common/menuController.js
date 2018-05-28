
define([ 'angular', 'app', 'services/menu' ], function(angular, app) {
  'use strict';
  var forEach = angular.forEach;
  var isDefined = angular.isDefined;
  app.controller('common/menuController', 
      ['$scope', 'api/user/resources', '$cookies', 'menu', '$window', '$location', '$log',
      function($scope, resources, $cookies, $menu, $window, $location, $log) {
        $log.debug("menuController");

        $scope.menu = [];
        
        /**
         * user의 role과 menu의 role을 비교하여 메뉴가 보여질지 안보일지 체크한다. 
         * menu의 role이 guest라면 모든 유저가 볼 수 있는 것이고 
         * 그 외에는 로그인 유저의 role과 menu의 role이 일치하는 것이 있어야 메뉴를 볼 수 있다.   
         */
        var roleCheck = function(roles) {
          var result = false;
          forEach(roles, function(role) {
            if (role === 'all') {
              result = true;
              return;
            }
            if(app_config.role.indexOf(role) > -1) {
              result = true;
              return;
            }
          });
          return result;
        };

        var filter = function(data) {
          var ret = [];
          forEach(data, function(item) {
            if (!item.visible) {
              return;
            }
            if (!roleCheck(item.roles)) {
              return;
            }
            var value = angular.copy(item);
            if (isDefined(value.sub)) {
              value.sub = filter(value.sub);
            }
            ret.push(value);
          });
          return ret;
        };

        $menu.get(function(data) {
          $scope.menu = filter(data);
        }, function(e) {
          $log.error(e);
        });

        $scope.existSub = function(item) {
          if (item.sub) {
            return true;
          } else {
            return false;
          }
        };
        
        $scope.isCurrent = function(item) {
          return $menu.match(item.id, true);
        };

        $scope.isExpanded = function(sub) {
          return $menu.match(sub.id, true);
        };

        $scope.go = function(item) {
          if (item.reload) {
            $window.location = item.url;
          } else {
            $location.path(item.url);
          }
        };

      }]);
});