/**
 * 
 * statisticsController
 * 
 */
define(['app','services/api/notice/resources'], function(app){
  'use strict';
  app.controller('user/statisticsController',
      ['$scope', 'api/notice/resources', '$modal', '$log',
        function ($scope, $noticeResources, $modal, $log) {
        $log.debug('user statisticsController');
          
        /**
         * Data for Radar chart
         */
        $scope.radarData = {
          labels: ["식료품", "공산품", "농산물", "광물", "금속", "기계", "수산물", "의류"],
          datasets: [
            {
                label: "화물별 운반 비율",
                fillColor: "rgba(98,203,49,0.2)",
                strokeColor: "rgba(98,203,49,1)",
                pointColor: "rgba(98,203,49,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "#62cb31",
                data: [15, 20, 15, 8, 12, 10, 12, 8]
            },
            {
              label: "화물별 운송비 비율",
              fillColor: "rgba(244,164,164,0.2)",
              strokeColor: "rgba(244,164,164,1)",
              pointColor: "rgba(244,164,164,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "#62cb31",
              data: [10, 25, 4, 9, 13, 18, 5, 6]
            },
          ]
        };

        /**
         * Options for Radar chart
         */
        $scope.radarOptions = {
            scaleShowLine : true,
            angleShowLineOut : true,
            scaleShowLabels : false,
            scaleBeginAtZero : true,
            angleLineColor : "rgba(0,0,0,.1)",
            angleLineWidth : 1,
            pointLabelFontFamily : "'Arial'",
            pointLabelFontStyle : "normal",
            pointLabelFontSize : 10,
            pointLabelFontColor : "#666",
            pointDot : true,
            pointDotRadius : 2,
            pointDotStrokeWidth : 1,
            pointHitDetectionRadius : 20,
            datasetStroke : true,
            datasetStrokeWidth : 1,
            datasetFill : true,
            showTooltips: true,
//              scaleShowLabels: true,
        };
        
        /**
         * Data for Doughnut chart
         */
        $scope.doughnutData = [
            {
                value: 22,
                color:"#62cb31",
                highlight: "#57b32c",
                label: "서울"
            },
            {
                value: 26,
                color: "#f4a4a4",
                highlight: "#f20202",
                label: "경기"
            },
            {
              value: 5,
              color: "#91dc6e",
              highlight: "#57b32c",
              label: "강원도"
            },
            {
              value: 13,
              color: "#a4f2cc",
              highlight: "#21efbc",
              label: "경상북도"
            },
            {
              value: 12,
              color: "#d8a4f2",
              highlight: "#a409f2",
              label: "경상남도"
            },
            {
              value: 5,
              color: "#f2efa4",
              highlight: "#f2e713",
              label: "충청북도"
            },
            {
              value: 12,
              color: "#c6c8f2",
              highlight: "#1722ef",
              label: "충청남도"
            },
            {
              value: 4,
              color: "#f2bea4",
              highlight: "#ed560b",
              label: "전라북도"
            },
            {
              value: 6,
              color: "#afa6f4",
              highlight: "#7a52f2",
              label: "전라남도"
            },
            {
              value: 3,
              color: "#ffee99",
              highlight: "#ffee99",
              label: "기타"
            }
        ];

        /**
         * Options for Doughnut chart
         */
        $scope.doughnutOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            segmentStrokeWidth : 1,
            percentageInnerCutout : 45, // This is 0 for Pie charts
            animationSteps : 100,
            animationEasing : "easeOutBounce", // easeOutQuart
            animateRotate : true,
            animateScale : false,
            showScale: true,
            scaleShowLabels: true,
            scaleLabel: "<%=value%>",
            showTooltips: true,
            multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        };

        /**
         * Data for Line chart
         */
        $scope.lineData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [22, 44, 67, 43, 76, 45, 12]
                },
                {
                    label: "Example dataset",
                    fillColor: "rgba(98,203,49,0.5)",
                    strokeColor: "rgba(98,203,49,0.7)",
                    pointColor: "rgba(98,203,49,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(26,179,148,1)",
                    data: [16, 32, 18, 26, 42, 33, 44]
                }
            ]
        };

        /**
         * Options for Line chart
         */
        $scope.lineOptions = {
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            bezierCurve : true,
            bezierCurveTension : 0.4,
            pointDot : true,
            pointDotRadius : 4,
            pointDotStrokeWidth : 1,
            pointHitDetectionRadius : 20,
            datasetStroke : true,
            datasetStrokeWidth : 1,
            datasetFill : true,
        };

        /**
         * Data for Sharp Line chart
         */
        $scope.sharpLineData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(98,203,49,0.5)",
                    strokeColor: "rgba(98,203,49,0.7)",
                    pointColor: "rgba(98,203,49,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(98,203,49,1)",
                    data: [33, 48, 40, 19, 54, 27, 54]
                }
            ]
        };

        /**
         * Options for Sharp Line chart
         */
        $scope.sharpLineOptions = {
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            bezierCurve : false,
            pointDot : true,
            pointDotRadius : 4,
            pointDotStrokeWidth : 1,
            pointHitDetectionRadius : 20,
            datasetStroke : true,
            datasetStrokeWidth : 1,
            datasetFill : true,
        };

        /**
         * Options for Bar chart
         */
        $scope.barOptions = {
            scaleBeginAtZero : true,
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            barShowStroke : true,
            barStrokeWidth : 1,
            barValueSpacing : 5,
            barDatasetSpacing : 1,
        };

        /**
         * Data for Bar chart
         */
        $scope.barData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(98,203,49,0.5)",
                    strokeColor: "rgba(98,203,49,0.8)",
                    highlightFill: "rgba(98,203,49,0.75)",
                    highlightStroke: "rgba(98,203,49,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        /**
         * Options for Single Bar chart
         */
        $scope.singleBarOptions = {
            scaleBeginAtZero : true,
            scaleShowGridLines : true,
            scaleGridLineColor : "rgba(0,0,0,.05)",
            scaleGridLineWidth : 1,
            barShowStroke : true,
            barStrokeWidth : 1,
            barValueSpacing : 5,
            barDatasetSpacing : 1,
        };

        /**
         * Data for Single Bar chart
         */
        $scope.singleBarData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My Second dataset",
                    fillColor: "rgba(98,203,49,0.5)",
                    strokeColor: "rgba(98,203,49,0.8)",
                    highlightFill: "rgba(98,203,49,0.75)",
                    highlightStroke: "rgba(98,203,49,1)",
                    data: [10, 20, 30, 40, 30, 50, 60]
                }
            ]
        };

  }]);
});
