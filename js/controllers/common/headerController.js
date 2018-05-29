
define(['angular', 'app', 'services/api/user/resources', 'services/api/message/resources', 
        'controllers/common/helpdesk/showMessageController', 'controllers/common/helpdesk/showNoticeController'],
    function(angular, app) {
  'use strict';
  var forEach = angular.forEach;
  var isDefined = angular.isDefined;
  app.controller('common/headerController',
  	['$scope', 'api/user/resources', 'api/message/resources', '$cookies', '$modal', '$location', '$log',
     function($scope, $userResources, $MsgResources, $cookies, $modal, $location, $log) {
  	  $log.debug('headerController');
    
  	  $scope.roles = [];
  	  $scope.definedRole = {'user':'사용자', 'admin':'관리자', 'superadmin':'슈퍼관리자', 'operator':'운영자', 'broker':'주선소'};
  	  $scope.init = function() {
  	    $log.debug(app_config.role);
  	    // 현재 선택된 role 화면 
  	    $scope.roles.push({key:app_config.type, name:$scope.definedRole[app_config.type], isActive:true});
  	    app_config.role.forEach(function(item) {
  	      if (item !== app_config.type) {
  	        if ($scope.definedRole[item]) {
  	          $scope.roles.push({key:item, name:$scope.definedRole[item], isActive:false});
  	        }
  	      }
  	    });
  	    $scope.pageRole = app_config.type;
  	  };
  	  
  	  $scope.movePage = function() {
  	    if (app_config.type !== $scope.pageRole) {
  	      window.location = ($scope.pageRole === 'user') ? '/' : '/'+$scope.pageRole; 
  	    }
  	  };
  	  
  	  $scope.checkRole = function(role) {
  	    if (!app_config.role) {
  	      return false; 
  	    }
  	    for (var i=0; i < app_config.role.length; i++) {
  	      if (app_config.role[i] === role) {
  	        return true;
  	      } 
  	    }
  	    return false;
  	  };

  	  $scope.tooltip = function(name, arg) {
  	    $('[data-toggle="' + name + '"]').tooltip(arg);
  	  };

  	  $scope.checkLogin = function() {
  	    if(angular.isUndefined($cookies.id)) {
  	    	//로그인이 안되어 있을 때 
  	    	$scope.loginStyle = "fa fa-sign-in";
  	    	$scope.userName = 'guest';
  	    } else {
  	    	//로그인이 되어 있을때 
  	    	$scope.loginStyle = "fa fa-sign-out";
          $scope.userName = $cookies.userName;
  	    }
      };
      
      $scope.isLogin = function() {
      	return !angular.isUndefined($cookies.id);
      };
      
      $scope.goLogin = function() {
      	if(angular.isUndefined($cookies.id)) {
        	//로그인이 안되어 있을 때 
        	$location.path('/common/login');
        } else {
          //로그인이 되어 있을때
          $userResources.logout({}, function(result){
            $scope.userName = 'guest';
            app_config.role = [];
            window.location = '/';
          });
        }
      };
      
      $scope.getMessages = function() {
        var param = {
            page : 0,
            limit : 5, 
            userId : $cookies.id  
        };
        $MsgResources.getMessagesByUser(param, function(result){
          $scope.messages = result;
        });
      };
      
      $scope.getNotices = function() {
        // nothing
      };
      
      $scope.showMessage = function(id) {
        var modalInstance = $modal.open({
          templateUrl: '/views/common/helpdesk/popup/showMessage.html',
          controller: 'common/helpdesk/showMessageController',
          size: 'lg',
          scope: $scope,
          resolve: {
            param : function() {
              return {id:id};
            },
            reload : function() {
              return $scope.getMessages;
            }
          }
        });
      };
      
      $scope.showNotice = function(id) {
        var modalInstance = $modal.open({
          templateUrl: '/views/common/helpdesk/popup/showNotice.html',
          controller: 'common/helpdesk/showNoticeController',
          size: 'lg',
          scope: $scope,
          resolve: {
            param : function() {
              return {id:id};
            },
            reload : function() {
              return $scope.getNotices;
            }
          }
        });
      };
      
      $scope.showChangeButton = function() {
        return false;
      };
      
      $scope.$on('show-message', function(event, obj) {
        $scope.showMessage(obj.id);
      });
      
      $scope.$on('show-notice', function(event, obj) {
        $scope.showNotice(obj.id);
      });
      
      $scope.init();
      $scope.checkLogin();
      $scope.getMessages();
  }]);
});