'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('DashboardCtrl', function ($scope, $state) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    //calendar
    /*$scope.eventSources = [];
   
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };*/
    
    $scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "June","Jul","Aug","Sep","Oct","Nov","Dec"];
    $scope.series = ['Active', 'Converted'];
    $scope.data = [
      [65, 59, 84, 81, 56, 55, 90,23,45,45,77,66],
      [28, 48, 40, 19, 35, 27,78,44,34,56,65,44]
    ];

    $scope.colours =[
      { // yellow
        fillColor: "rgba(253,180,92,0.2)",
        strokeColor: "rgba(253,180,92,1)",
        pointColor: "rgba(253,180,92,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(253,180,92,0.8)"
      },
      { // blue
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,0.8)"
      }
    ];
    $scope.labels1 = ["Active", "Converted"];
    $scope.series1 = ['Active', 'Converted'];
    $scope.data1 = [58, 48 ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
      $state.transitionTo('home');
    };
  });
