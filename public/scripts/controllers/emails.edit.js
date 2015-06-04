'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:EmailsEditCtrl
 * @description
 * # EmailsEditCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('EmailsEditCtrl', function ($scope, $state, $stateParams, auth, Emails, participant) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.prospect_name = $stateParams.prospectName;
    $scope.prospect_id = $stateParams.prospectId;
    $scope.from = auth.profile.name;
    $scope.from_name = auth.profile.name;
        $scope.fetchParticipantList = function(){
            participant.getParticipantForProspect($stateParams.prospectId)
                .success (function (data){
                $scope.participants = '';
                for(var i=0;i<data.length;i++)
                {
                    $scope.participants += data[i].email + ",";
                }
                $scope.participants = $scope.participants.substr(0,$scope.participants.length-1);
                $scope.newEmail = {
                    to: $scope.participants
                }
            })
                .error (function (error){
                console.log (error);
            });
        }
        //fetch participants for this prospect
        $scope.fetchParticipantList();

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
