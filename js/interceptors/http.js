define([
        'app',
        'interceptors/http/api',
//        'interceptors/http/cache'
        ],
    function(app, apiFilter, cacheFilter) {
  
  // configures http interceptors
  app.config(function($httpProvider) {
    //$httpProvider.interceptors.push(cacheFilter);
    $httpProvider.interceptors.push(apiFilter);
  });
});