
define(['angular', 'app'], function(angular, app) {
  'use strict';
  app.controller('common/calendarController',
      ['$scope', '$location', '$modal', '$log',
     function($scope, $location, $modal,  $log) {
        $log.debug('common/calendarController');

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.alertMessage = "Report all events from UI calendar.";

        // Events
        $scope.events = [
            {title: 'All Day Event',start: new Date(y, m, 1)},
            {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
            {id: 999,title: 'Repeating Event2',start: new Date(y, m, d + 4, 16, 0),allDay: false},
            {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
            {title: 'Homer task',start: new Date(y, m, d + 5, 19, 0),end: new Date(y, m, d + 6, 22, 30),allDay: false, backgroundColor :"#62cb31", borderColor :"#62cb31"},
            {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];

        /* message on eventClick */
        $scope.alertOnEventClick = function(calEvent, jsEvent, view){
          $scope.modalInstance = $modal.open({
            templateUrl: '/views/common/calendar/showEvent.html',
            controller: 'common/calendar/showEventController',
            size: 'md',
            scope: $scope,
            resolve: {
              param : function() {
                return {
                  event : calEvent,
                  view : view
                };
              }
            }
          });
        };
        
        /* message on Drop */
        $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
            $scope.alertMessage = (event.title +': Droped to make dayDelta ' + dayDelta);
        };
        
        /* message on Resize */
        $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
            $scope.alertMessage = (event.title +': Resized to make dayDelta ' + minuteDelta);
        };
        
        $scope.dayClick = function(date, event, view){
          $scope.modalInstance = $modal.open({
            templateUrl: '/views/common/calendar/addEvent.html',
            controller: 'common/calendar/addEventController',
            size: 'md',
            scope: $scope,
            resolve: {
              addEvent : function() {
                return $scope.addEvent;
              },
              param : function() {
                return {
                  view : view,
                  date : date
                };
              }
            }
          });
        };

        $scope.addEvent = function(event) {
          $scope.events.push(event);
        };
        
        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 550,
                editable: true,
                header: {
                    left: 'today',
                    center: 'revYear, prev, title, next, nextYear',
                    right: 'month,agendaWeek,agendaDay'
                },
                buttonText : {
                  today : '오늘',
                  month : '월',
                  agendaWeek : '주',
                  agendaDay : '일'
                },
                views : {
                  agendaWeek : {
                    timeFormat : 'H(:mm)',
                  }
                },
                slotDuration : '01:00:00',
                titleFormat : 'YYYY년 MM월',
                dayNames : ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
                dayNamesShort : ['일', '월', '화', '수', '목', '금', '토'],
                monthNames : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ],
                dayClick : $scope.dayClick,
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };

        /* Event sources array */
        $scope.eventSources = [$scope.events];

      }]);
});