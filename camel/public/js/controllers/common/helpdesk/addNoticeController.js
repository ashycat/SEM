
define(['app', 'services/api/notice/resources', 'factories/sweet-alert'], function(app){
  app.controller('common/helpdesk/addNoticeController', 
      ['$scope', 'api/notice/resources', 'sweetAlert', '$modalInstance', 'reload', '$cookies', '$log', 'Upload',
       function ($scope, resources, sweetAlert, $modalInstance, reload, $cookies, $log, Upload) {
        $log.debug("addNoticeController");

        $scope.subject = "";
        $scope.content = "";
        var files = [];
        
        $scope.canSave = function() {
          if (!$cookies.id) {
            return false;
          }
          if ($scope.subject === '') {
            return false;
          }
          if($scope.content === '') {
            return false;
          }
          return true;
        };
        
        $scope.save = function() {
          $log.debug('upload', files);
          $log.debug('files.length', files.length);
          var names = [];
          var uploadNames = [];
          var size = [];
          var count = 0;
          
          if (files.length !== 0){
            
            for (var i=0; i < files.length; i++) {
              (function(index) {
                var file = files[index];
                Upload.upload({
                  url: 'api/file/upload',
                  fields: {'username': $scope.username},
                  file: file
                }).progress(function (evt) {
                  var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  $log.debug('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                  $log.debug('file ' + config.file.name + 'uploaded. Response: ' + data);
                  $log.debug('data.contents : ' , data.contents);
                  names.push(config.file.name);
                  size.push(config.file.size);
                  uploadNames.push(data.contents);
                  
                  if (names.length === files.length || uploadNames.length === files.length) {
                    
                    $log.debug("name on success", names);
                    var param = {
                        subject : $scope.subject,
                        content : $scope.content,
                        fileName : names,
                        uploadName : uploadNames,
                        size : size
                    };
                    resources.addNotice(param, function(result) {
                      $scope.$close();
                      reload();
                    });
                  }
                });
              })(i);
            }
          } else {
            var param = {
                subject : $scope.subject,
                content : $scope.content,
            };
            resources.addNotice(param, function(result) {
              $scope.$close();
              reload();
            });
          }
				};
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
        
        $scope.selectFiles = function (file) {
          $log.debug('files', file);
          files = file;
        };

    }]);
});