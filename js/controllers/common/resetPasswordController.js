
define(['angular', 'app', 'ngRoute',
        'services/api/user/resources', 'factories/sweet-alert'], 
        function(angular, app) {
  'use strict';
  app.controller('common/resetPasswordController',
      ['$scope', '$routeParams', 'api/user/resources', 'sweetAlert', '$log', '$location',
      function($scope, $routeParams, resources, sweetAlert, $log, $location) {
    $log.debug("resetPasswordController");
    $scope.user_id = $location.search().user_id;
    
    $scope.resetPassword = function() {
      if($scope.password !== $scope.repeat_password){
        sweetAlert.swal({
          title: "비밀번호가 일치하지 않습니다.",
          text: "비밀번호를 다시 확인해 주세요"
        });
        $scope.password="";
        $scope.repeat_password="";
      } else {
        var param = {
            password : $scope.password,
            id : $location.search().id
            };
        resources.modifyPassword(param, function(){
          $location.path('/#/dashboard');
        }, function(err) {
          alert('에러가 발생하였습니다. [' + err.data.code + '] ' + err.data.message);              
          $log.debug("user insert error ", err);
        });
      }  
    };
  }]);
});