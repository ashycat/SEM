/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */
(function() {
  var requirePaths = {
      'jquery' : '/bower_components/jquery/dist/jquery.min',
      'datatables' : '/bower_components/datatables/media/js/jquery.dataTables.min',
      'jquery-ui' : '/bower_components/jquery-ui/jquery-ui.min',
      'slimScroll' : '/bower_components/slimScroll/jquery.slimscroll.min.js',
      'bootstrap' : '/bower_components/bootstrap/dist/js/bootstrap.min',
      'jquery-flot' : '/bower_components/jquery-flot/jquery.flot',
      'jquery-flot-resize' : '/bower_components/jquery-flot/jquery.flot.resize',
      'jquery-flot-pie' : '/bower_components/jquery-flot/jquery.flot.pie',
      'jquery-flot-curvedlines' : '/bower_components/flot.curvedlines/curvedLines',
      'jquery-flot-spline' : '/bower_components/jquery.flot.spline/index',
      'angular' : '/bower_components/angular/angular',
      'angular-animate' : '/bower_components/angular-animate/angular-animate.min',
      'angular-ui-router' : '/bower_components/angular-ui-router/release/angular-ui-router',
      'angular-bootstrap' : '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
      'angular-flot' : '/bower_components/angular-flot/angular-flot',
      'chartjs' : '/bower_components/chartjs/Chart.min',
      'angular-ui-select' : '/bower_components/angular-ui-select/dist/select',
      'angular-sanitize' : '/bower_components/angular-sanitize/angular-sanitize',
      'check-types': '/bower_components/check-types/src/check-types.min',
      'metisMenu' : '/bower_components/metisMenu/dist/metisMenu.min',
      'sweetalert' : '/bower_components/sweetalert/lib/sweet-alert',
      'iCheck' : '/bower_components/iCheck/icheck.min',
      'sparkline' : '/bower_components/sparkline/index',
      'angles' : '/bower_components/angles/angles',
      'peity' : '/bower_components/peity/jquery.peity.min',
      'angular-peity' : '/bower_components/angular-peity/angular-peity',
      'angular-notify' : '/bower_components/angular-notify/dist/angular-notify.min',
      'angular-ui-utils' : '/bower_components/angular-ui-utils/ui-utils',
      'angular-ui-map' : '/bower_components/angular-ui-map/ui-map',
      'moment' : '/bower_components/moment/min/moment.min',
      'angular-moment' : '/bower_components/angular-moment/angular-moment.min',
      'fullcalendar' : '/bower_components/fullcalendar/dist/fullcalendar.min',
      'angular-ui-calendar' : '/bower_components/angular-ui-calendar/src/calendar',
      'summernote' : '/bower_components/summernote/dist/summernote.min',
      'angular-summernote' : '/bower_components/angular-summernote/dist/angular-summernote.min',
      'ng-grid' : '/bower_components/ng-grid/ng-grid-2.0.14.debug',
      'angular-ui-tree' : '/bower_components/angular-ui-tree/dist/angular-ui-tree.min',
      'restangular' : '/bower_components/restangular/dist/restangular',
      'lodash' : '/bower_components/lodash/dist/lodash.min',
      'ngCookies' : '/bower_components/angular-cookies/angular-cookies.min',
      'LocalStorageModule' : '/bower_components/angular-local-storage/dist/angular-local-storage',
      'checklist-model' : '/bower_components/checklist-model/checklist-model',
      'toastr' : '/bower_components/toastr/toastr.min',
      'angular-toastr' : '/bower_components/angular-toastr/dist/angular-toastr.tpls',
      'angular-bootstrap-datetimepicker' : '/bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker',
      'ui-utils' : '/bower_components/angular-ui-utils/ui-utils',
      'fcsa-number' : '/bower_components/angular-fcsa-number/src/fcsaNumber.min',
      'ngFileUpload' : '/bower_components/ng-file-upload/ng-file-upload.min',
      'ngMask' : '/bower_components/angular-mask/dist/ngMask.min',
      'angular-datatables' : '/bower_components/angular-datatables/dist/angular-datatables',
      'angular-xeditable' : '/bower_components/angular-xeditable/dist/js/xeditable.min',
      'angular-ui-sortable' : '/bower_components/angular-ui-sortable/sortable.min',
      'angular-footable' : '/bower_components/angular-footable/dist/angular-footable.min',
      'ngRoute' : '/bower_components/angular-route/angular-route.min',
  };
  
  var requireShims = {
      'jquery': { exports: '$' },
      'datatables': { 
        "deps": ['jquery'], 
        "exports": '$.fn.dataTable' 
      }, 
      'angular' : { exports: 'angular', deps: ['jquery'] },
      'bootbox': ['jquery', 'bootstrap'],
      'bootstrap' : ['jquery'],
      'angular-ui-utils': ['angular'],
      'fcsa-number' : ['angular'],
//      'angular-ui-bootstrap': ['bootstrap', 'angular'],
      'angular-ui-router': ['angular'],
      'angular-sanitize': ['angular'],
      'angular-ui-select': ['angular'],
      'restangular':['angular'],
      'angular-animate':['angular'],
      'angular-ui-map':['angular'],
      'angular-flot':['angular'],
      'angular-peity':['angular'],
      'angular-bootstrap':['bootstrap', 'angular'],
      'angular-ui-tree':['angular'],
      'angular-ui-calendar':['angular'],
      'ng-grid': ['angular'],
      'chartjs':['angular'],
      'angles': ['angular'],
      'app' : ['bootstrap', 'angular'],
      'ngCookies' : ['angular', 'angular-ui-router'],
      'LocalStorageModule' : ['angular'],
      'checklist-model' : ['angular'],
      'angular-bootstrap-datetimepicker' : ['angular'],
      'angular-toastr' : ['angular'],
      'ngFileUpload' : ['angular'],
      'ngMask' : ['angular'],
      'angular-datatables' : ['angular'],
      'angular-xeditable' : ['angular'],
      'angular-ui-sortable' : ['angular'],
      'angular-footable' : ['angular'],
      'ngRoute' : ['angular'],
  };
  
  require.config({
    baseUrl: '/js',
    urlArgs: 'ts=' + (new Date()).getTime(),
    paths: requirePaths,
    shim: requireShims,
    packages: ['app']
  });
  
  require(['jquery', 'angular', 'app', 'app/config'], function($, angular, app) {
    angular.element(document).ready(function () {
      fixWrapperHeight();
      setBodySmall();
      app.init();
    });
    
    $(window).bind("resize click", function () {
        setBodySmall();
        setTimeout(function () {
            fixWrapperHeight();
        }, 300);
    });
    
    function fixWrapperHeight() {
    
        // Get and set current height
        var headerH = 62;
        var navigationH = $("#navigation").height();
        var contentH = $(".content").height();
    
        // Set new height when contnet height is less then navigation
        if (contentH < navigationH) {
            $("#wrapper").css("min-height", navigationH + 'px');
        }
    
        // Set new height when contnet height is less then navigation and navigation is less then window
        if (contentH < navigationH && navigationH < $(window).height()) {
            $("#wrapper").css("min-height", $(window).height() - headerH  + 'px');
        }
    
        // Set new height when contnet is higher then navigation but less then window
        if (contentH > navigationH && contentH < $(window).height()) {
            $("#wrapper").css("min-height", $(window).height() - headerH + 'px');
        }
    }
    
    function setBodySmall() {
        if ($(this).width() < 769) {
            $('body').addClass('page-small');
        } else {
            $('body').removeClass('page-small');
            $('body').removeClass('show-sidebar');
        }
    }
  });
  
})();
