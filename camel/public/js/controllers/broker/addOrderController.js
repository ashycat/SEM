
/**
 * 
 * addOrderController
 * 
 */

define(['app', 
        'services/api/order/resources', 
        'services/api/google/resources',
        'services/api/consigner/resources',
        'services/api/location/resources',
        'services/api/goods/resources'
        ], function(app){
  'use strict';
  app.controller('broker/addOrderController',
      ['$scope', 'api/order/resources', 'api/google/resources', 
       'api/consigner/resources', 'api/location/resources', 'api/goods/resources',  
       '$modalInstance', 'reload', '$log',  
        function ($scope, $orderResources, $google, $consignerResources, 
            $locationResources, $goodsResources, $modalInstance, $reload, $log) {
          $log.debug('broker addOrderController');
          $scope.params = {type:'NORMAL'};  // 일반오더
          $scope.params2 = {};
          
          // 차량 무게 
          $scope.weights = [{name:'0.3', value:0.3}, 
                            {name:'0.5', value:0.5}, 
                            {name:'1', value:1}, 
                            {name:'1.4', value:1.4}, 
                            {name:'2.5', value:2.5}, 
                            {name:'3.5', value:3.5}, 
                            {name:'5', value:5}, 
                            {name:'8', value:8}, 
                            {name:'11', value:11}, 
                            {name:'14', value:14}, 
                            {name:'15', value:15}, 
                            {name:'25', value:25}];
          // 상하차 방법 
          $scope.loadMethods = [{name:'지게차', value:1}, 
                               {name:'수작업', value:2}, 
                               {name:'호이스트', value:3}, 
                               {name:'크레인', value:4}, 
                               {name:'컨베이어', value:5}];

          // 상하차 방법 
          $scope.loadMethods = [{name:'지게차', value:1}, 
                               {name:'수작업', value:2}, 
                               {name:'호이스트', value:3}, 
                               {name:'크레인', value:4}, 
                               {name:'컨베이어', value:5}];

          $scope.todayOrTom = [{name:'당일', value:'1'}, {name:'내일', value:'2'}];
          $scope.ampm = [{name:'오전', value:'AM'}, {name:'오후', value:'PM'}];
          $scope.oclock = [{name:'정각', value:'00'}, {name:'30분', value:'30'}];
          $scope.hours = [{name:'1시', value:'01'}, 
                          {name:'2시', value:'02'}, 
                          {name:'3시', value:'03'}, 
                          {name:'4시', value:'04'}, 
                          {name:'5시', value:'05'}, 
                          {name:'6시', value:'06'}, 
                          {name:'7시', value:'07'}, 
                          {name:'8시', value:'08'}, 
                          {name:'9시', value:'09'}, 
                          {name:'10시', value:'10'}, 
                          {name:'11시', value:'11'}, 
                          {name:'12시', value:'12'} 
                          ];
          $scope.paymentType = [{name:'인수증', value:1}, 
                                {name:'선/착불', value:2}, 
                                {name:'수수료', value:3}];
          
          $scope.Props = {
              id : 'value',
              name : 'name',
              btnStyle : 'btn-xs btn-success' 
          };
          
          $scope.address = {};
          $scope.refreshAddresses = function(address) {
            $log.debug('>>> : ', $scope.params);
            $google.getAddresses(address, function(data) {
              $scope.addresses = data;
            });
          };

          $scope.setConsigner = function() {
            $log.debug($scope.params2.consigner);
            $scope.params.senderName = $scope.params2.consigner.name;
            $scope.params.senderTelephone = $scope.params2.consigner.telephone;
            $scope.params.senderHandphone = $scope.params2.consigner.handphone;
          };
          
          $scope.findConsigners = function(name) {
            if (!name || name.length < 2) {
              return;
            }
            var param = {name:name};
            $consignerResources.findConsigners(param, function(data) {
              $scope.consigners = data;
              data.forEach(function(item, index) {
                $scope.consigners[index].full_name = item.company_name + " " + item.name;
              });
            });
            
          };
          
          $scope.refreshSource = function(name) {
            if (!name || name.length < 2) {
              return;
            }
            var param = {name:name};
            $locationResources.findLocations(param, function(data) {
              $scope.sources = data;
              data.forEach(function(item, index) {
                $scope.sources[index].full_name = item.metro_name + " " + item.city_name1 + " " + item.city_name2 + " " + item.name;
              });
            });
          };
          
          $scope.refreshDestination = function(name) {
            if (!name || name.length < 2) {
              return;
            }
            var param = {name:name};
            $locationResources.findLocations(param, function(data) {
              $scope.destinations = data;
              data.forEach(function(item, index) {
                $scope.destinations[index].full_name = item.metro_name + " " + item.city_name1 + " " + item.city_name2 + " " + item.name;
              });
            });
          };
          
          $scope.refreshGoodsCategory = function(name) {
            if (!name || name.length < 2) {
              return;
            }
            var param = {name:name};
            $goodsResources.findGoodsCategories(param, function(data) {
              $scope.goodsCategories = data;
              data.forEach(function(item, index) {
                $scope.goodsCategories[index].full_name = item.category + " " + item.name;
              });
            });
          };
          
          // 상차 일시 컨트롤 
          $scope.getLoadDateTime = function() {
            if(!$scope.params2.loadDate && !$scope.params2.loadDay) {
              $scope.params2.loadDateTmp = undefined;
              return '';
            }
            if(!$scope.params2.loadAMPM || 
                !$scope.params2.loadHour || !$scope.params2.loadMinute) {
              return '';
            }
            
            if ($scope.params2.loadDay === '1') {
              $scope.params2.loadDateTmp = new Date();
            } else if ($scope.params2.loadDay === '2') {
              $scope.params2.loadDateTmp = new Date().setDate(new Date().getDate()+1);
            } else {
              $scope.params2.loadDay = undefined;
              $scope.params2.loadDateTmp = $scope.params2.loadDate;
            }
            
            var date = new Date($scope.params2.loadDateTmp);
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var day = ('0' + date.getDate()).slice(-2);
            
            return [year, "-", month, "-", day, " ", 
                    ($scope.params2.loadAMPM === 'AM' ? '오전' : '오후'), " ",
                    $scope.params2.loadHour, "시 ",
                    $scope.params2.loadMinute, "분"].join('');
          };
          
          // 하차 일시 컨트롤  
          $scope.getUnLoadDateTime = function() {
            if(!$scope.params2.unloadDate && !$scope.params2.unloadDay) {
              $scope.params2.unloadDateTmp = undefined;
              return '';
            }
            if(!$scope.params2.unloadAMPM || 
                !$scope.params2.unloadHour || !$scope.params2.unloadMinute) {
              return '';
            }
            
            if ($scope.params2.unloadDay === '1') {
              $scope.params2.unloadDateTmp = new Date();
            } else if ($scope.params2.unloadDay === '2') {
              $scope.params2.unloadDateTmp = new Date().setDate(new Date().getDate()+1);
            } else {
              $scope.params2.unloadDateTmp = $scope.params2.unloadDate;
            }
            
            var date = new Date($scope.params2.unloadDateTmp);
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var day = ('0' + date.getDate()).slice(-2);
            
            return [year, "-", month, "-", day, " ", 
                    ($scope.params2.unloadAMPM === 'AM' ? '오전' : '오후'), " ",
                    $scope.params2.unloadHour, "시 ",
                    $scope.params2.unloadMinute, "분"].join('');
            
          };
          
          $scope.canSave = function() {
            if (angular.element('#weight').hasClass('ng-invalid-fcsa-number')) {
              return false;
            }
            if (angular.element('#height').hasClass('ng-invalid-fcsa-number')) {
              return false;
            }
            if (!($scope.params2.consigner && $scope.params2.consigner.id)) {
              return false;
            } 
            if (!($scope.params2.goodsCategory&& $scope.params2.goodsCategory.id)) {
              return false;
            } 
            if (!($scope.params2.source && $scope.params2.source.id)) {
              return false;
            } 
            if (!($scope.params2.destination && $scope.params2.destination.id)) {
              return false;
            } 
            
            if (!$scope.params.goodsWeight || !$scope.params.goodsLength || 
                !$scope.params.senderHandphone || !$scope.params.senderTelephone ||
                !$scope.params.sendeeHandphone || !$scope.params.sendeeTelephone ||
                !$scope.params.description ||
                !$scope.params2.loadDateTmp || !$scope.params2.unloadDateTmp ||
                !$scope.params2.loadHour || !$scope.params2.unloadHour ||
                !$scope.params2.loadMinute || !$scope.params2.unloadMinute ||
                !$scope.params.loadMethod || !$scope.params.unloadMethod ||
                !$scope.params.truckWeight || !$scope.params.truckCount ||
                !$scope.params.paymentType || !$scope.params.freight || !$scope.params.fee
                
                ) {
              $log.debug($scope.params,$scope.params2);
              return false;
            }
            return true;
          };
          
          $scope.save = function() {
            $scope.params.consignerId = $scope.params2.consigner.id;
            $scope.params.sourceId = $scope.params2.source.id;
            $scope.params.destinationId = $scope.params2.destination.id;
            $scope.params.goodsCategoryId = $scope.params2.goodsCategory.id;
            $scope.params.loadDate = $scope.dateFormat($scope.params2.loadDateTmp, 
                $scope.params2.loadHour, $scope.params2.loadMinute, $scope.params2.loadAMPM);
            $scope.params.unloadDate = $scope.dateFormat($scope.params2.unloadDateTmp, 
                $scope.params2.unloadHour, $scope.params2.unloadMinute, $scope.params2.unloadAMPM);

            $orderResources.addOrder($scope.params, function(result) {
              $reload();
              $modalInstance.close();
            }, function(response) {
              
            });
          };
          
          $scope.dateFormat = function(date, h, m, ampm) {
            date = new Date(date);
            var day = ('0' + date.getDate()).slice(-2);
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var year = date.getFullYear();
            var ap = (ampm === 'AM') ? 0 : 12; 
            var hour = ('0' + (h*1+ap)).slice(-2);
            var minute = ('0' + m).slice(-2);
            
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';
          };
          
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

  }]);
});
