
define(['app', 'services/api/notice/resources', 'factories/sweet-alert'], function(app){
  'use strict';
  app.controller('common/helpdesk/showNoticeController', 
      ['$scope', 'api/notice/resources', 'sweetAlert', '$modalInstance', 'param', 'reload', '$log',    
       function ($scope, resources, sweetAlert, $modalInstance, param, reload, $log) {
        $log.debug("showNoticeController");
        $scope.files = [];

        $scope.getNotice = function(id) {
          resources.getNotice({id:id}, function(result) {
            $scope.notice = result.contents;
            $scope.files = result.info;
          });
        };
        
        $scope.fileDownload = function(uploadName, originName) {
          window.location = 'files/' + uploadName;
        };
        
        $scope.delete = function(id) {
          sweetAlert.swal({
            title: "정말로 공지사항을 삭제하시겠습니까?",
            text: "공지사항을 삭제하면 다시 복구할 수 없습니다.",
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
                resources.deleteNotice({id:id}, function(result){
                  reload();
                  sweetAlert.swal("삭제완료", "공지사항이 삭제되었습니다", "success");
                  $scope.$close();
                });
              } else {
                sweetAlert.swal("취소", "공지사항을 삭제하지 않았습니다 :)", "error");
              }
          });
        };
        
        $scope.showChangeButton = function() {
          return $scope.$parent.showChangeButton();
        };
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.getNotice(param.id);
    }]);
});