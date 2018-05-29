/**
 * 
 * role_groupController
 * 
 */

define(['app', 
        'services/api/consigner/resources', 
        'services/api/user/resources', 
        'services/api/businesscodes/resources', 
        'factories/sweet-alert'], function(app){
  app.controller('broker/addConsignerController', 
    ['$scope', 
     'api/consigner/resources',
     'api/user/resources', 
     'api/businesscodes/resources', 
     '$cookies', 'sweetAlert', '$modal', '$log', '$modalInstance', 'reload',   
      function ($scope, resources, userresources, businessCodeResource, $cookies, sweetAlert, $modal, $log, $modalInstance, reload) {
        $log.debug('addConsignerController');
        
        $scope.selectedItem = {};
        
        // 업태 입력에 따라 DB를 조회
        $scope.refreshBusinessCondition = function(name) {
          if (!name || name.length < 2) {
            return;
          }
          var param = {name:name};
          businessCodeResource.findBusinessCondition(param, function(data) {
            $scope.businessConditions = data;
            data.forEach(function(item, index) {
              $scope.businessConditions[index].full_name = '[' + item.id + "]" + item.name_kr;
            });
          });
        };
        $scope.setBusinessCondition = function() {
          $scope.business_condition = $scope.selectedItem.businessCondition.id;
        };

        // 업종 입력에 따라 DB를 조회
        $scope.refreshBusinessType = function(name) {
          if (!name || name.length < 2) {
            return;
          }
          var param = {name:name};
          businessCodeResource.findBusinessType(param, function(data) {
            $scope.businessTypes = data;
            data.forEach(function(item, index) {
              $scope.businessTypes[index].full_name = '[' + item.id + "]" + item.name_kr;
            });
          });
        };
        $scope.setBusinessType = function() {
          $scope.business_type = $scope.selectedItem.businessType.id;
        };
        
        
        // form validator
        $scope.canSave = function() {
          if ($scope.name === undefined) {
            return false;
          }
          if($scope.phone === undefined) {
            return false;
          }
          if($scope.fax === undefined) {
            return false;
          }
          if($scope.member_name === undefined) {
            return false;
          }
          if($scope.member_handphone === undefined) {
            return false;
          }
          if($scope.member_telephone === undefined) {
            return false;
          }
          if($scope.member_email === undefined) {
            return false;
          }
          if($scope.business_taxtype === undefined) {
            return false;
          }
          if($scope.business_license === undefined) {
            return false;
          }
          if($scope.business_ceo_name === undefined) {
            return false;
          }
          if($scope.business_name === undefined) {
            return false;
          }
          if($scope.selectedItem.businessCondition === undefined) {
            return false;
          }
          if($scope.selectedItem.businessType === undefined) {
            return false;
          }
          // TODO : nullable 컬림인데 foreign key가 걸려 있어 수정이 필요하다.
          if($scope.business_address_id === undefined) {
            return false;
          }
          return true;
        };
        $scope.insertOk = function () {
          var param = { 
              // 기본정보
              name : $scope.name, // 거래처명
              phone : $scope.phone,
              fax : $scope.fax,
              broker_id : $cookies.brokerId,
              creator : $cookies.id,
              // 사업자정보
              business_taxtype : $scope.business_taxtype,
              business_ceo_name : $scope.business_ceo_name, // 대표자명
              business_name : $scope.business_name, // 상호명
              business_license : $scope.business_license, // 사업자번호
              business_condition : $scope.business_condition, // 업태
              business_type : $scope.business_type, // 업종
              business_address_id : $scope.business_address_id,
              business_address_detail : $scope.business_address_detail,
              // 담당자정보
              member_name : $scope.member_name,
              member_telephone : $scope.member_telephone, // 비상전화
              member_handphone : $scope.member_handphone, // 휴대전화
              member_email : $scope.member_email, // 휴대전화
              member_description : $scope.member_description
          };
          resources.create(param, function() {
            $log.debug('addConsigner');
            //reload();
          });
          $modalInstance.close();
        };

        /*********** 하단 버튼들 **********/
        $scope.cancel = function () {
           $modalInstance.dismiss('cancel');
        };
      }
    ]
  );
});
