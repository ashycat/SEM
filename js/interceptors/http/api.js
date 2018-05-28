define([
        'angular',
        'services/api/errorcodes',
        'toastr',
        ], function(angular, codes, toastr) {
  'use strict';
  
  var isApi = function(config) {
    return config.url.match(/^\/api\//);
  };
  
  var postDataToParam = function(config) {
    if (config.method === 'POST' && angular.isDefined(config.data)) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.transformRequest = function(data) {
        return $.param(data);
      };
    } else {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
  };
  
  var handleApiRequest = function(config) {
    if (isApi(config)) {
      postDataToParam(config);
    }
  };
  
  return function($q, $location, $window, $log) {
    return {
      request: function(config) {
        handleApiRequest(config);
        return config || $q.when(config);
      },
      requestError: function(why) {
        return $q.reject(why);
      },
      response: function(response) {
        if (isApi(response.config)) {
          switch (response.data.code) {
          case codes.OK:
            break;
          case codes.AUTHENTICATION_ERROR:
            $log.error('Authentication error: ' + response.contents);
            if (angular.isDefined(response.config.params) &&
                angular.isDefined(response.config.params._pass_auth_error) &&
                response.config.params._pass_auth_error) {
                return $q.reject(response);
            }
            session.clear();
            $window.location = '/';
            break;
          case codes.ACCESS_DENIED:
            toastr.warning('요청정보에 권한이 없습니다.');
            return $q.reject(response);
          default:
            return $q.reject(response);
          }
        }
        return response || $q.when(response);
      },
      responseError: function(response) {
        if (isApi(response.config)) {
          switch (response.status) {
          case 0:
              if (response.data !== null) {
                  toastr.error('서버와 접속이 되지 않습니다.');
              }
            break;
          case 404:
            toastr.error('잘못된 URL로 요청하였습니다.');
            break;
          case 405:
            toastr.error('해당 URL은 ' + response.config.method + '를 지원하지 않습니다.');
            break;
          case 500:
            toastr.error('서버에서 알 수 없는 오류가 발생하였습니다.');
            break;
          }
        }
        return $q.reject(response);
      }
    };
  };
});