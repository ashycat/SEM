define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.controller('panelController', function($scope, $element, $timeout) {
    $scope.close = true;
    $scope.hide = true;
    
    // Function for collapse ibox
    $scope.showhide = function () {
      var hpanel = $element.closest('div.hpanel');
      var icon = $element.find('i:first');
      var body = hpanel.find('div.panel-body');
      var footer = hpanel.find('div.panel-footer');
      body.slideToggle(300);
      footer.slideToggle(200);
      // Toggle icon from up to down
      icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
      hpanel.toggleClass('').toggleClass('panel-collapse');
      $timeout(function () {
        hpanel.resize();
        hpanel.find('[id^=map-]').resize();
      }, 50);
    };
    // Function for close ibox
    $scope.closebox = function () {
      var hpanel = $element.closest('div.hpanel');
      hpanel.remove();
    };    
    
    this.setHide = function(bool) {
      $scope.hide = bool;
    };
    
    this.setClose = function(bool) {
      $scope.close = bool;
    };
    
  });
  
  app.directive('panelTools', function () {
    return {
      restrict: 'A',
//      scope: true,
      scope: {
        showClose: '@',
        showHide: '@'
      },
      templateUrl: 'views/common/panel_tools.html',
      controller: 'panelController',
      link : function(scope, element, attrs, controller) {
        controller.setHide(/^true$/i.test(attrs.hide));
        controller.setClose(/^true$/i.test(attrs.close));
      }
    };
  });
});