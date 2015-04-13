'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('HomeCtrl', function ($scope, ProspectService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    /*$scope.prospects = [
      {name: "Yvolver",state:"New",_id:"1"},
      {name: "PayWize",state:"Internal Preparation",_id:"2"},
      {name: "CNM Connect",state:"Initiation",_id:"3"}
    ];*/
    $scope.prospectList = ProspectService.getAllProspects()
      .success (function (data){
      $scope.prospects = data;
      console.log("in controler:" + $scope.prospects);
    })
      .error (function (error){
      console.log (error);});
    console.log("list controler:" + $scope.prospects);
  });

