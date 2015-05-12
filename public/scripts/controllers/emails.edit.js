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

    $scope.prospect_name = $stateParams.prospectName;
    $scope.prospect_id = $stateParams.prospectId;
    $scope.from = $stateParams.from;
    $scope.from_name = $stateParams.from;
    //$scope.to = $stateParams.to;
    $scope.stage = $stateParams.stage;
    $scope.subject = "Presale Prospect: " + $scope.prospect_name;

    $scope.sendEmail = function (newEmail) {
    	newEmail = newEmail || {};

        $scope.newEmail = {};

        Emails.sendEmail(newEmail, $scope.from, $scope.from_name, $scope.subject, $scope.prospect_id,$scope.stage);
        
        $state.transitionTo('auth.prospect.view', {prospectId: $scope.prospect_id});
       // $state.transitionTo('prospect.view', {prospectId: 2});
      };

  });
