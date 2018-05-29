
/**
 * 
 * customerController
 * 
 */

define( [ 'app', 'services/api/user/resources', 
          'services/api/broker/resources', 
          'services/api/consigner/resources', 
          'services/api/truck/resources'], function(app) { 
  'use strict';
  app.controller('broker/customerController',
      ['$scope', 'api/user/resources', 'api/broker/resources',
       'api/consigner/resources', 'api/truck/resources', '$modal', '$cookies', '$log',
       function($scope, $userResources, $brokerResources, $consignerResources, $truckResources, $modal, $cookies, $log) {
         $log.debug('customerController');

         $scope.currentUserName = undefined;
         $scope.truckCurrentPage = 1;
         $scope.consignerCurrentPage = 1;
         
         $scope.getBroker = function() {
           $brokerResources.getBroker({id:$cookies.id}, function(data) {
             $scope.broker = data;
             $scope.currentUserName = data.name;
             $scope.currentInformation = "";
           });
         };
         
         $scope.getTruckList = function() {
           var param = {
               brokerId : $cookies.id,
               page : $scope.truckCurrentPage - 1, 
               limit : 10
           };
           $truckResources.findTrucks(param, function(data){
             $scope.trucks = data;
             $scope.trucks.forEach(function(item, index){
               $userResources.findById(item.owner_id, function(data){
                 $scope.trucks[index].user = data;
               });
             });
           });
         };
         
         $scope.getConsignerList = function() {
           var param = {
               brokerId : $cookies.id,
               page : $scope.consignerCurrentPage - 1, 
               limit : 10
           };
           $consignerResources.findConsigners(param, function(data){
             $scope.consigners = data;
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
         
         /** 
          * Google Map
          */
         $scope.lat = "0";
         $scope.lng = "0";
         $scope.accuracy = "0";
         $scope.error = "";
         $scope.model = { myMap: undefined };
         $scope.myMarkers = [];
         
         $scope.mapOptions = {
             zoom: 15,
//             center: new google.maps.LatLng(37.521572, 126.926379),
             styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
             mapTypeId: google.maps.MapTypeId.ROADMAP
         };

         $scope.moveMap = function(type, index) {
           if (type === 'truck') {
             $scope.currentTitle = '차주';
             $scope.currentUserName = $scope.trucks[index].user.user_name;
             $scope.currentInformation = '핸드폰번호 : ' + $scope.trucks[index].user.handphone + ' 전화번호 : ' + $scope.trucks[index].user.telephone;
           } else {
             $scope.currentTitle = '화주';
             $scope.currentUserName = $scope.consigners[index].name;
             $scope.currentInformation = '핸드폰번호 : ' + $scope.consigners[index].handphone + ' 전화번호 : ' + $scope.consigners[index].telephone;
           }
           var latlng = new google.maps.LatLng(37.521572, 126.926379);
           $scope.model.myMap.setCenter(latlng);
           $scope.myMarkers = [];
           $scope.myMarkers.push(new google.maps.Marker({ map: $scope.model.myMap, position: latlng }));
         };
         
         $scope.showPosition = function (position) {
           $scope.lat = position.coords.latitude;
           $scope.lng = position.coords.longitude;
           $scope.accuracy = position.coords.accuracy;
           $scope.$apply();

           var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
           $scope.model.myMap.setCenter(latlng);
           $scope.myMarkers.push(new google.maps.Marker({ map: $scope.model.myMap, position: latlng }));
         };
         
         $scope.showError = function (error) {
           switch (error.code) {
               case error.PERMISSION_DENIED:
                   $scope.error = "User denied the request for Geolocation.";
                   break;
               case error.POSITION_UNAVAILABLE:
                   $scope.error = "Location information is unavailable.";
                   break;
               case error.TIMEOUT:
                   $scope.error = "The request to get user location timed out.";
                   break;
               case error.UNKNOWN_ERROR:
                   $scope.error = "An unknown error occurred.";
                   break;
           }
           $scope.$apply();
         };
         
         // PC의 위치를 표시해준다. 
         $scope.getLocation = function () {
           if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
           }
           else {
               $scope.error = "Geolocation is not supported by this browser.";
           }
         };

         $scope.getLocation();
         $scope.getTruckList();
         $scope.getConsignerList();
         $scope.getBroker();
    }]);
});