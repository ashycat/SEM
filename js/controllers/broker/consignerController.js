
define(['app', 
        'services/api/consigner/resources', 
        'services/api/broker/resources', 
        'factories/sweet-alert'], 
        function(app){
  'use strict';
  app.controller('broker/consignerController', 
      ['$scope', 'api/consigner/resources', 'api/broker/resources', '$modal', 'sweetAlert','$cookies', '$log',
        function ($scope, resources, brokerResource, $modal, sweetAlert, $cookies, $log) {
          $scope.currentPage = 1;
        
          // 목록 표시
          $scope.mySelections = [];
          $scope.gridOptions = {
            data: 'consignerList',
            selectedItems: $scope.mySelections,
            multiSelect: false,
            columnDefs: [
              {field:'id', displayName: '번호'},
              {field:'name', displayName: '사업자명/회사 '},
              {field:'phone', displayName: '대표전화번호 '},
              {field:'fax', displayName: 'FAX'},
              {field:'broker_id', displayName: '주선소 ID'},
              {field:'status', displayName: '상태'},
              {field:'creator', displayName: '생성자'},
              {field:'created', displayName: '생성일시'},
              {field:'modifier', displayName: '수정자'},
              {field:'modified', displayName: '수정일시'},
            ],
            //rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell [[col.cellClass]]"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>'
          };

          $scope.showConsigner = function() {
            $log.debug('consigner : func showConsiger');
            resources.list({}, function(result){
              $scope.consignerList = result;
              $log.debug('result : ', result);
            });
          };
          
          $scope.addConsigner = function() {
            var modalInstance = $modal.open({
              templateUrl: '/views/broker/addConsigner.html',
              controller: 'broker/addConsignerController',
              size: 'lg',
              scope: $scope,
              resolve: {   
                reload : function() {
                  return $scope.showConsigner;
                }
              }
            });
          };
          
//          $scope.deleteConsigner = function (row) {
//            sweetAlert.swal({
//              title: "Are you sure?",
//              text: "Your will not be able to recover this imaginary file!",
//              type: "warning",
//              showCancelButton: true,
//              confirmButtonColor: "#DD6B55",
//              confirmButtonText: "Yes, delete it!",
//              cancelButtonText: "No, cancel plx!",
//              closeOnConfirm: false,
//              closeOnCancel: false },
//              function (isConfirm) {
//                if (isConfirm) {
//                  var param = {id : row.entity.id};
//                  resources.delete(param, function() {
//                    $scope.showConsigner();
//                    sweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
//                  }, function(err){
//                    $log.debug(err);
//                    alert('err', err);
//                  });
//                } else {
//                  sweetAlert.swal("Cancelled", "Your imaginary file is safe :)", "error");
//                }
//            });
//          };
          
          $scope.onDblClickRow = function(row) {
            $scope.myrow=row.entity;
            var modalInstance = $modal.open({
              templateUrl: 'views/broker/modifyConsigner.html',
              controller: ModifyConsignerCtrl,
              resolve: {
                items: function () {
                  return row.entity;
                }, 
                reload : function() {
                  return $scope.showConsigner;
                }
              }
            });
          };
        
          var ModifyConsignerCtrl = function ($scope, $modalInstance, items, reload, $log) {
              $scope.items = items;
              $log.debug('items', items.id);
              $scope.updateOk = function () {
                var param = { 
                    id : items.id,
                    name : $scope.name,
                    business : $scope.business,
                    telephone : $scope.telephone,
                    handphone : $scope.handphone,
                    broker : $scope.broker,
                    status : 'ACTIVE',
                    creator : $cookies.id
                };
                resources.update(param, function() {
                  reload();
                });
                $modalInstance.close();
              };
              $scope.cancel = function () {
                $modalInstance.close();
              };
          };
       
          // CAM-32
          // 주선소에 속한 화주 목록 표시
          $scope.listConsignerByBroker = function() {
            var param = {
              limit : 10,
              page : $scope.currentPage - 1,
              broker_id : $cookies.brokerId  
            };
            brokerResource.listConsignerByBroker(param, function(result){
              $scope.consignerList = result;
            });
          };
          // 담당자 조회
          $scope.showMembers = function() {
            console.log("########## showMembers1:",  $scope.mySelections);
            console.log("########## showMembers2:",  $scope);
          };
          
          //$scope.showConsigner();  
          $scope.listConsignerByBroker();
    }]);
});

