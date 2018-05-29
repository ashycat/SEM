
define(['app', 
        'services/api/trucktype/resources',
        'factories/sweet-alert',
        'filters/filterLabel'], function(app){
  'use strict';
  app.controller('common/trucktypeController',
      ['$scope', 'api/trucktype/resources', 'sweetAlert', '$cookies', '$modal', '$log', 'toastr',
        function ($scope, $trucktypeResources, sweetAlert, $cookies, $modal, $log, toastr) {
          $log.debug('trucktypesController');
          
          $log.debug("trucktypeController");
          $scope.trucktypes = [];
          
          $scope.currentPage = 1;
          $scope.$watch("currentPage", function() {
            $scope.getTrucktypelist();
          });
          
          // 차종 조회
          $scope.getTrucktypelist = function() {
            var param = {
                limit : 10,
                page : $scope.currentPage-1
            };
            
            $trucktypeResources.getTrucktypelist(param, function(result) {
              $scope.trucktypes = result.contents;
              $scope.trucktypes_info = result.info;
            });
          };
          
          /*
          // 차종 조회
          $scope.showTrucktypes = function () {
            console.log('showTrucktypes');
            $trucktypeResources.getTrucktypelist({},function(result) {
              console.log("dd", result);
              $scope.trucktypes = result.contents;
              $scope.trucktypes_info = result.length; 
            });
          }();
          
       
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
                return $scope.getMessageList;
              }
            }
          });
        };
        
        $scope.addMessage = function() {
          var modalInstance = $modal.open({
            templateUrl: '/views/common/helpdesk/popup/addMessage.html',
            controller: 'common/helpdesk/addMessageController',
            size: 'lg',
            scope: $scope,
            resolve: {
              reload : function() {
                return $scope.getMessageList;
              }
            }
          });
        };
        
        $scope.showChangeButton = function() {
          // TODO : user와 role을 보고 적용해야 한다. 
          return !!$cookies.id;
        };
        
       // 차종 추가
          $scope.addTrucktypePopup = function() {
            var modalInstance = $modal.open({
              templateUrl: '/views/common/addTrucktype.html',
              controller: 'common/popup/addTrucktypeController',
              size: 'lg',
              scope: $scope,
              resolve: {   
                reload : function() {
                  var param = {
                      id : $scope.id
                  }
                  $trucktypeResources.findTrucktypes(param, function(result) {
                    $scope.addTrucktypes = result.contents;
                    $scope.addTrucktypes_info = result.info;
                  })
                }
              }
            });
          };
          
          // 차종 삭제
          $scope.deleteTrucktype = function(id){
            console.log("deleteTrucktype", id);
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
                    id : id
                  };
                  $trucktypeResources.deleteTrucktype(param, function(result) {
                    sweetAlert.swal("삭제완료", "삭제되었습니다", "success");
                    
                    $scope.showTrucktypes();
                  });
                } else {
                  sweetAlert.swal("취소", "삭제하지 않았습니다 ", "error");
                }
              }
            );
          };
          */
  }]);
});
