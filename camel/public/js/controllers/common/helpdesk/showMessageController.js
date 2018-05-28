
define(['app', 'services/api/message/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('common/helpdesk/showMessageController', 
      ['$scope', 'api/message/resources', 'sweetAlert', '$modalInstance', 'param', 'reload', '$log',    
       function ($scope, resources, sweetAlert, $modalInstance, param, reload, $log) {
        $log.debug("showMessageController", app_config.type);

        $scope.getMessage = function(id) {
          resources.getMessage({id:id}, function(result) {
            $scope.message = result.contents;
          });
        };
        
        $scope.delete = function(id) {
          sweetAlert.swal({
            title: "정말로 메시지를 삭제하시겠습니까?",
            text: "메시지를 삭제하면 다시 복구할 수 없습니다.",
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
                resources.deleteMessage({id:id}, function(result){
                  reload();
                  sweetAlert.swal("삭제완료", "메시지가 삭제되었습니다", "success");
                  $scope.$close();
                });
              } else {
                sweetAlert.swal("취소", "메시지를 삭제를 취소하였습니다. :)", "error");
              }
          });
        };
        
        $scope.showChangeButton = function() {
          return $scope.$parent.showChangeButton();
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.getMessage(param.id);
    }]);
});