'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:EmailsEditCtrl
 * @description
 * # EmailsEditCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('EmailsEditCtrl', function ($scope, $state, $stateParams, auth, Emails, participant, ProspectService, CyclesService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.prospect_name = $stateParams.prospectName;
    $scope.prospect_id = $stateParams.prospectId;
    $scope.stage_id = $stateParams.stage;
    $scope.from = auth.profile.name;
    $scope.from_name = auth.profile.name;
    $scope.cycle_id = $stateParams.cycle_id;
    $scope.cycle_no = $stateParams.cycle_no;
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
        newEmail.cycle_id = $scope.cycle_id;
        newEmail.cycle_no = $scope.cycle_no;
        Emails.sendEmail(newEmail, $scope.from, $scope.from_name, $scope.subject, $scope.prospect_id,$scope.stage);
        //check if this is first email and close the initition stage
       // console.log("Current stage:"+$scope.stage);
        if($scope.stage == 1)
        {
            //complete initiation stage
            ProspectService.updateStage($scope.prospect_id,"Internal Preparation","3");
            //update cycle
            var newCycle = {};
            newCycle._id = $scope.cycle_id;
            newCycle.current_state = 3;

            CyclesService.updatecycle(newCycle);

        }
        $state.transitionTo('auth.prospect.view', {prospectId: $scope.prospect_id});
       // $state.transitionTo('prospect.view', {prospectId: 2});
      };
        $scope.cancelEmail = function(){
            window.history.back();
        }

  });
