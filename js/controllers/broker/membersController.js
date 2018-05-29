
define(['app', 
        'services/api/broker/resources', 
        'services/api/user/resources',
        'factories/sweet-alert',
        'filters/filterLabel'], function(app){
  'use strict';
  app.controller('broker/membersController',
      ['$scope', 'api/broker/resources', 'api/user/resources', 'sweetAlert', '$cookies', '$modal', '$log', 'toastr',
        function ($scope, $brokerResources, $userResources, sweetAlert, $cookies, $modal, $log, toastr) {
          $log.debug('broker public membersController');
          $scope.currentPage = 1;
          $scope.pageChanged = function() {
            $scope.showMembers();
          };
          
          // TOGO : 페이징
          
          // 주선소 멤버 목록 조회
          $scope.showMembers = function() {
            var param = {
                limit : 10,
                page : $scope.currentPage - 1,
                broker_id : $cookies.brokerId
            };
            $brokerResources.showMembers(param, function(result) {
              $scope.members = result.contents;
              $scope.members_info = result.info; 
            });
          };
          
          // 주선소 멤버 등록
          $scope.addMemberPopup = function() {
            var modalInstance = $modal.open({
              templateUrl: '/views/broker/popup/addMember.html',
              controller: 'broker/addMemberController',
              size: 'lg',
              scope: $scope,
              resolve: {
                reload : function() {
                  var param = {
                      limit : 10,
                      page : $scope.currentPage - 1,
                      broker_id : $cookies.brokerId
                  };
                  $brokerResources.findMembers(param, function(result) {
                    $scope.addMembers = result.contents;
                    $scope.addMembers_info = result.info;
                  });
                }
              }
            });
          };
         
          // 주선서 멤버 권한 수정 
          $scope.updateMember = function(index) {
            var modalInstance = $modal.open({
              templateUrl: '/views/broker/popup/updateMember.html',
              controller: 'broker/updateMemberController',
              size: 'lg',
              scope: $scope,
              resolve: {
                reload : function() {
                  return $scope.getOrderList;
                }, 
                param : function() {
                  return {
                    member : $scope.members[index]
                  };
                }
              }
            });
          };
          
          // 주선소 맴버 삭제
          $scope.deleteMember = function(broker_id, user_id){
            console.log("deleteMember", broker_id, user_id);
            sweetAlert.swal({ 
              title: "정말로 삭제하시겠습니까?",
              text: "삭제하면 다시 복구할 수 없습니다.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, 삭제합니다!",
              cancelButtonText: "No, 취소합니다!",
              closeOnConfirm: false,
              closeOnCancel: false 
              },
              function (isConfirm) {
                if (isConfirm) {
                  var param = {
                    broker_id : broker_id,
                    user_id : user_id
                  };
                  $brokerResources.deleteMember(param, function(result) {
                    sweetAlert.swal("삭제완료", "삭제되었습니다", "success");
                    
                    $scope.showMembers();
                  });
                } else {
                  sweetAlert.swal("취소", "삭제하지 않았습니다 ", "error");
                }
              }
            );
          };
          
          $scope.showMembers();
  }]);
});
