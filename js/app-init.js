/**
 * HOMER - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 */
(function() {
  var requirePaths = {
      'jquery' : 'layout/scripts/jquery.min',
      'datatables' : 'lib/DataTables/datatables.min',
      'jquery-ui' : 'layout/scripts/jquery-ui.min'

  };

  var requireShims = {
      'jquery': { exports: '$' },
      'datatables': {
        "deps": ['jquery'],
        "exports": '$.fn.dataTable'}

  };

  require.config({
    baseUrl: 'js',
    urlArgs: 'ts=' + (new Date()).getTime(),
    paths: requirePaths,
    shim: requireShims,
    packages: ['app']
  });

  require(['jquery', 'app', 'app/config'], function($, app) {

    $(document).ready(function () {
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
