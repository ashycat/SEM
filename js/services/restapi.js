define(['app'], function(app){
  app.factory('RestApi', ['Restangular', '$cookies', function(Restangular, $cookies) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/api');
      RestangularConfigurer.setDefaultRequestParams({apiKey: $cookies.apiKey, secretKey: $cookies.secretKey});
      RestangularConfigurer.setResponseExtractor(function(response, operation) {
        return response.contents;
      });
    });
  }]);
  app.factory('WrappedRestApi', ['Restangular', '$cookies', function(Restangular, $cookies) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/api');
      RestangularConfigurer.setDefaultRequestParams({apiKey: $cookies.apiKey, secretKey: $cookies.secretKey});
      RestangularConfigurer.setResponseExtractor(function(response, operation) {
        return response;
      });
    });
  }]);
});