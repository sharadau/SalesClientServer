/**
 * Created by sharadau on 15-05-2015.
 */
'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
    .controller('ChartCtrl', function ($scope, $state, ProspectService) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        console.log("month2:"+$state.month);
        $scope.forMonth = $state.month;
       /* $scope.prospectList = ProspectService.getProspectsInitiatedInMonth($state.month,"2015")
            .success (function (data){
            $scope.prospects = data;
            console.log("in view controler:" + $scope.prospects);
        })
            .error (function (error){
            console.log (error);});*/

        var monthMapping = new Array();

        monthMapping[0] = new Array();
        monthMapping[1] = new Array();
        monthMapping[2] = new Array();
        monthMapping[3] = new Array();
        monthMapping[4] = new Array();
        monthMapping[5] = new Array();
        monthMapping[6] = new Array();
        monthMapping[7] = new Array();
        monthMapping[8] = new Array();
        monthMapping[9] = new Array();
        monthMapping[10] = new Array();
        monthMapping[11] = new Array();
        monthMapping[12] = new Array();

        monthMapping[0][0] = "Jan";
        monthMapping[0][1] = "1";
        monthMapping[1][0] = "Feb";
        monthMapping[1][1] = "2";
        monthMapping[2][0] = "Mar";
        monthMapping[2][1] = "3";
        monthMapping[3][0] = "Apr";
        monthMapping[3][1] = "4";
        monthMapping[4][0] = "May";
        monthMapping[4][1] = "5";
        monthMapping[5][0] = "Jun";
        monthMapping[5][1] = "6";
        monthMapping[6][0] = "Jul";
        monthMapping[6][1] = "7";
        monthMapping[7][0] = "Aug";
        monthMapping[7][1] = "8";
        monthMapping[8][0] = "Sep";
        monthMapping[8][1] = "9";
        monthMapping[9][0] = "Oct";
        monthMapping[9][1] = "10";
        monthMapping[10][0] = "Nov";
        monthMapping[10][1] = "11";
        monthMapping[11][0] = "Dec";
        monthMapping[11][1] = "12";

        $scope.prospects =  new Array();

        for( var i=0;i<12;i++) {
            if ( $state.month == monthMapping[i][0])
                $scope.mon = monthMapping[i][1];
        }

        $scope.prospectList = ProspectService.getAllProspects()
            .success (function (data){
           // $scope.prospects = data;
            var j=0;
            data.forEach(function (project) {

                var dt = new Date(project.start_date);
                console.log("start date:"+project.start_date+" month:"+dt.getMonth()+" for month:"+$scope.mon);
                if((dt.getMonth() +1) == $scope.mon)
                {
                    $scope.prospects[j] =  project;
                    j++;
                }
            });
        })
            .error (function (error){
            console.log (error);});

    });
