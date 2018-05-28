
define(['angular', 'app', 
        'services/api/user/resources', 'services/api/mail/resources', 'filters/filterLabel', 'factories/sweet-alert'],
        function(angular, app) {
  'use strict';
  var forEach = angular.forEach;
  var isDefined = angular.isDefined;

  app.controller('common/registerController', 
     [ '$scope', 'api/user/resources', 'api/mail/resources', '$location', '$log', 'sweetAlert',
       function($scope, resources, mail, $location, $log, sweetAlert) {
       
       $scope.registerEnable = false;
       $scope.userIdCheck = function() {
         var param = {
             user_id : $scope.user_id
         };
         resources.checkUserId(param, function(result){
           // TODO
           if(angular.isUndefined(result)){
             sweetAlert.swal({
               title: "사용가능한 아이디입니다.",
               text: "이 아이디로 하시겠습니까?"
             });
             $scope.registerEnable = true;
           }else {
             sweetAlert.swal({
               title: "중복된 아이디 입니다.",
               text: "다른 아이디를 입력해주세요."
             });
             $scope.user_id="";
             $scope.registerEnable = false;
           }
         }, function(err) {
           alert('에러가 발생하였습니다. [' + err.data.code + '] ' + err.data.message);              
         });
       };
       
       
       $scope.register = function() {
         if(angular.isUndefined($scope.user_name)
            || angular.isUndefined($scope.email)
            || angular.isUndefined($scope.user_id)
            || angular.isUndefined($scope.password) 
            || angular.isUndefined($scope.repeat_password)
            || angular.isUndefined($scope.phone) ){
           return;
         }
         
         if($scope.password !== $scope.repeat_password) {
           sweetAlert.swal({
             title: "비밀번호가 일치하지 않습니다.",
             text: "비밀번호를 다시 확인해 주세요"
           });
           $scope.password="";
           $scope.repeat_password="";
           return;
         } 
         
         var param = { 
           user_id : $scope.user_id, 
           user_name : $scope.user_name,
           password : $scope.password,
           email : $scope.email,
           phone : $scope.phone
         };
         
         resources.addUser(param, function(){
           // TODO 
           $location.path('/#/dashboard');
         }, function(err) {
           alert('에러가 발생하였습니다. [' + err.data.code + '] ' + err.data.message);              
           $log.debug("user insert error ", err);
         });
       };
     }]);
});