'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:EmailsEditCtrl
 * @description
 * # EmailsEditCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('EmailsEditCtrl', function ($scope, $state, $stateParams, Emails) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    console.log("$StateParams:"+$stateParams.prospectName);
    $scope.prospect_name = $stateParams.prospectName;
    $scope.prospect_id = $stateParams.prospectId;
    $scope.from = $stateParams.from;
    $scope.stage = $stateParams.stage;
    console.log("stage in cntroler:"+$scope.stage);
    $scope.subject = "Presale Prospect: " + $scope.prospect_name;
    
    $scope.sendEmail = function (newEmail) {
    	newEmail = newEmail || {};

        $scope.newEmail = {};
       
        //newEmail._id = getUniqueTime();
        Emails.sendEmail(newEmail, $scope.from, $scope.subject, $scope.prospect_id,$scope.stage);
        
        $state.transitionTo('prospect.view', {prospectId: $scope.prospect_id});
       // $state.transitionTo('prospect.view', {prospectId: 2});
      };

  });
