
define(['app'], function(app){
  'use strict';
  app.controller('common/calendar/addEventController', 
      ['$scope', '$modalInstance', 'param', 'addEvent', '$log',
       function ($scope, $modalInstance, $param, $addEvent, $log) {
        $log.debug("addEventController", $param);

        $scope.type = $param.view.type;
        $scope.subject = '';
        $scope.param = {};
        
        $scope.init = function() {
          if ($param.date.hasTime()) {
            var date = new Date($param.date);
            $scope.param.start = date.getUTCHours();
            $scope.param.end = date.getUTCHours() + 1;
            
            $scope.startTime = $scope.getTimeString(''+$scope.param.start);
            $scope.endTime = $scope.getTimeString(''+$scope.param.end);
          }
        };
        
        $scope.startTimes = [ {name:'오전 0시',value:'0', key:'AM00'},
                              {name:'오전 1시',value:'1', key:'AM01'},
                              {name:'오전 2시',value:'2', key:'AM02'},
                              {name:'오전 3시',value:'3', key:'AM03'},
                              {name:'오전 4시',value:'4', key:'AM04'},
                              {name:'오전 5시',value:'5', key:'AM05'},
                              {name:'오전 6시',value:'6', key:'AM06'},
                              {name:'오전 7시',value:'7', key:'AM07'},
                              {name:'오전 8시',value:'8', key:'AM08'},
                              {name:'오전 9시',value:'9', key:'AM09'},
                              {name:'오전 10시',value:'10', key:'AM10'},
                              {name:'오전 11시',value:'11', key:'AM11'},
                              {name:'오전 12시',value:'12', key:'AM12'},
                              {name:'오후 1시',value:'13', key:'PM13'},
                              {name:'오후 2시',value:'14', key:'PM14'},
                              {name:'오후 3시',value:'15', key:'PM15'},
                              {name:'오후 4시',value:'16', key:'PM16'},
                              {name:'오후 5시',value:'17', key:'PM17'},
                              {name:'오후 6시',value:'18', key:'PM18'},
                              {name:'오후 7시',value:'19', key:'PM19'},
                              {name:'오후 8시',value:'20', key:'PM20'},
                              {name:'오후 9시',value:'21', key:'PM21'},
                              {name:'오후 10시',value:'22', key:'PM22'},
                              {name:'오후 11시',value:'23', key:'PM23'},
                              ];

        $scope.endTimes = [];

        $scope.getTimeString = function(key) {
          for (var i=0; i < $scope.startTimes.length; i++) {
            if ($scope.startTimes[i].value === key) {
              return $scope.startTimes[i].name;
            }
          }
          return '미정의 시간';
        };
        

        $scope.takeTime = function() {
          return $scope.type === 'month' || !$param.date.hasTime();
        };
        
        $scope.selectStartTime = function() {
          $scope.endTimes = [];
          for (var i = $scope.param.start*1 + 1; i < $scope.startTimes.length; i++) {
            $scope.endTimes.push($scope.startTimes[i]);
          }
          $scope.endTimes.push($scope.startTimes[0]);
          $scope.param.end = $scope.param.start*1 + 1; 
        };
        
        $scope.canSave = function() {
          if($scope.subject.length === 0) {
            return false;
          }
          if (!$scope.param.start) {
            return false;
          }
          if (!$scope.param.end) {
            return false;
          }
          return true;
        };
        
        $scope.save = function() {
          var start;
          var end;
          var date = new Date($param.date);
          var d = date.getDate();
          var m = date.getMonth();
          var y = date.getFullYear();

          if ($param.date.hasTime()) {
            var t = date.getUTCHours();
            start = new Date(y, m, d, t, 0);
            end = new Date(y, m, d, t+1, 0);
          } else {
            start = new Date(y, m, d, $scope.param.start*1, 0);
            end = new Date(y, m, d, $scope.param.end*1, 0);
          }
          var event = {
              title : $scope.subject,
              start : start,
              end : end,
              className : ['event']
          };
          $addEvent(event);
          $scope.$close();
				};
        
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.init();
    }]);
});