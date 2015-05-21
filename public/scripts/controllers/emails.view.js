'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:EmailsListCtrl
 * @description
 * # EmailsListCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('EmailsViewCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.emails = [
      {subject: "Initied Yvolver1",body:"New",_id:"1",date:"12/10/2014"},
      {subject: "Initied PayWize",body:"Internal Preparation",_id:"2",date:"02/10/2014"},
      {subject: " Initied CNM Connect",body:"Initiation",_id:"3",date:"12/12/2014"}
    ];
        $scope.emailsSelected = new Array();

        $scope.selectEmail = function(email_id){
                console.log("emails is selected");
            $scope.emailsSelected[$scope.emailsSelected.length] = email_id;
        };
        $scope.moveEmail = function(){
            console.log("selected emails:"+$scope.emailsSelected);
        };
  });
