'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('DashboardCtrl', function ($scope, $state, ProspectService) {
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

        $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        $scope.chartData = {
            "labels": $scope.months,
            "series": ['Active', 'Converted'],
            "series1": ['Bay Area', 'Texas'],
            "series2": ['Initiated', 'Converted'],
            "series3": ['Hemant', 'Subu', 'Ashish'],
            "data":[],
            "data1":[],
            "data2":[],
            "data3":[],
            "data4":[]
        }

        var prospectList = ProspectService.getAllProspects()
            .success (function (data){
            $scope.projects = data;
            $scope.totalActiveProjects =  $scope.projects.length;
            $scope.totalEastCoastProjects =  $scope.projects.length;
            $scope.data = [];
            $scope.data1 = [];
            $scope.data2 = [];
            $scope.data3 = [];
            $scope.data4 = [];
            $scope.bayarea = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.bayareaInitiated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.eastcoast = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.eastcoastInitiated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.active = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.converted = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.initiated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.initiatedBy1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.initiatedBy2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.initiatedBy3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            $scope.projects.forEach(function(project){
                console.log("project::"+project.name);

                $scope.chartData.data = [];

                $scope.months.forEach(function (i, m) {

                    //for active vs converted
                    if((typeof project.end_date) == "string") {
                        var date1 = new Date(project.end_date);

                        if (date1.getMonth() == m) {
                            $scope.converted[m] = $scope.converted[m] + 1;
                            if(project.area == "Bay Area")
                            {
                                $scope.bayarea[m] = $scope.bayarea[m] + 1;
                            }else if(project.area == "Texas")
                            {
                                $scope.eastcoast[m] = $scope.eastcoast[m] + 1;
                            }

                        }

                    }
                    //for active vs converted
                    if((typeof project.start_date) == "string") {
                        var date2 = new Date(project.start_date);

                        if (date2.getMonth() == m) {
                            $scope.initiated[m] = $scope.initiated[m] + 1;
                            if(project.area == "Bay Area")
                            {
                                $scope.bayareaInitiated[m] = $scope.bayareaInitiated[m] + 1;
                            }else if(project.area == "Texas")
                            {
                                $scope.eastcoastInitiated[m] = $scope.eastcoastInitiated[m] + 1;
                            }

                        }

                    }
                    //for Initiated by
                    if((typeof project.start_date) == "string") {
                        var date3 = new Date(project.start_date);

                        if (date3.getMonth() == m) {
                            //$scope.initiatedBy[m] = $scope.initiatedBy[m] + 1;
                            if(project.initiatedBy == 'Hemant Elhence')
                            {
                                $scope.initiatedBy1[m] = $scope.initiatedBy1[m] + 1;
                            }else if(project.initiatedBy == 'Ashish Shanker')
                            {
                                $scope.initiatedBy2[m] = $scope.initiatedBy2[m] + 1;
                            }else if(project.initiatedBy == 'Subu Sankara')
                            {
                                $scope.initiatedBy3[m] = $scope.initiatedBy3[m] + 1;
                            }

                        }

                    }

                });

            });
            $scope.months.forEach(function (i, m) {
                $scope.active[m] = $scope.totalActiveProjects - $scope.converted[m];
                $scope.totalActiveProjects = $scope.totalActiveProjects - $scope.converted[m];
            });

            $scope.chartData.data.push([$scope.active,$scope.converted]);
            $scope.chartData.data1.push([$scope.bayarea,$scope.eastcoast]);
            $scope.chartData.data2.push([$scope.bayareaInitiated,$scope.eastcoastInitiated]);
            $scope.chartData.data3.push([$scope.initiated,$scope.converted]);
            $scope.chartData.data4.push([$scope.initiatedBy1,$scope.initiatedBy2, $scope.initiatedBy3]);
            console.log("data3" + $scope.chartData.data3[0]);

        })
            .error (function (error){
            console.log (error);}
        );

        //$scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "June","Jul","Aug","Sep","Oct","Nov","Dec"];
    //$scope.series = ['Active', 'Converted'];
    //$scope.data = dashboardService.getYearlyStats();

    /*$scope.data = [
      [65, 59, 84, 81, 56, 55, 90,23,45,45,77,66],
      [28, 48, 40, 19, 35, 27,78,44,34,56,65,44]
    ];*/

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
      },
        { // green
            fillColor: "rgba(200,120,100,0.2)",
            strokeColor: "rgba(200,120,100,1)",
            pointColor: "rgba(200,120,100,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(200,120,100,0.8)"
        }
    ];
    $scope.labels1 = ["Active", "Converted"];
    $scope.series3 = ["Initiated", "Converted"];
    $scope.labels2 = ["Bay Area", "Texas"];
    $scope.series1 = ['Active', 'Converted'];
    $scope.series2 = ['Bay Area', 'Texas'];
    $scope.data1 = [58, 48 ];
    $scope.onClick = function (points, element) {
      console.log(JSON.stringify(points));
        console.log("month: "+points[0].label);
        $state.month = points[0].label;
      $state.transitionTo('auth.chart');
    };
  });
