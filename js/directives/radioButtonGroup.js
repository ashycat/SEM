define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.directive('radioButtonGroup', function() {
    return {
      restrict: 'E',
      scope: { 
        model: '=', 
        options: '=', 
        id: '=', 
        name: '=', 
        btnstyle: '='
      },
      controller: function($scope) {
        $scope.activate = function (option, $event) {
          if ($scope.model === option[$scope.id]) {
            $scope.model = undefined;
            $event.target.blur();
          } else {
            $scope.model = option[$scope.id];
          }

          if ($event.stopPropagation) {
            $event.stopPropagation();
          }
          if ($event.preventDefault) {
            $event.preventDefault();
          }
          $event.cancelBubble = true;
          $event.returnValue = false;
        };
        
        $scope.isActive = function(option) {
          return option[$scope.id] === $scope.model;
        };
        
        $scope.getName = function (option) {
          return option[$scope.name];
        };
      },
      template: "<button type='button' class='btn [[btnstyle]]' " +
      		"ng-class='{active: isActive(option)}'" +
          "ng-repeat='option in options' " +
          "ng-click='activate(option, $event)'>[[getName(option)]] " +
          "</button>"
    };
  });
});