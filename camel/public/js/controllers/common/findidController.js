'use strict';

define(['angular', 'app', 
        'services/api/user/resources', 'services/api/mail/resources'], 
        function(angular, app) {
  app.controller('common/findidController',
      ['$scope', 'api/user/resources', 'api/mail/resources', '$log',
      function($scope, resources, mail, $log, $location ) {
    $log.debug("findidController");

    $scope.findID = function(){
      var param = {
          user_name : $scope.name,
          email : $scope.email,
          phone : $scope.phone
      };
      resources.findByPhone(param, function(result) {
        if(result[0].user_name === $scope.name 
          && result[0].phone === $scope.phone
          && result[0].email === $scope.email) {
          
          mail.send(result[0], function() {
          }, function(err) {
            alert('에러가 발생하였습니다. [' + err.data.code + '] ' + err.data.message);              
            $log.debug("eamil send error ", err);
          });
          console.log('잇');
        } else {
          //TODO alert 정보 확인
          alert("정보가 일치 하지 않습니다. ");
        }
        
//        $location.path('/#/dashboard');
      }, function(err) {
        alert('에러가 발생하였습니다. [' + err.data.code + '] ' + err.data.message);              
        $log.debug("find User By phone error ", err);
      });
    };
    
  }]);
});