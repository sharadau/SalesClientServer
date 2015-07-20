'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:ParticipantListCtrl
 * @description
 * # ParticipantListCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('ParticipantListCtrl', function ($scope, $state, $stateParams, $http, participant) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  $scope.prospect_id = $stateParams.prospectId;
  $scope.prospect_name = $stateParams.prospectName;
  $scope.fetchList = function(){
    participant.getParticipantForProspect($stateParams.prospectId)
      .success (function (data){
      $scope.participants = data;
        $scope.participantsEmails = new Array();
        for(var k=0;k<data.length;k++)
        {
            $scope.participantsEmails[k] = data[k].email;
        }
    })
      .error (function (error){
      console.log (error);
    });
  }
    $scope.fetchList();

    // Any function returning a promise object can be used to load values asynchronously
    $scope.getEmployees = function(val) {
        var participantsEmailIds = $scope.participantsEmails;
      return $http.get(service_base_url+'/api/employees/name/'+val, {
      }).then(function(response){
          var newOne = new Array();

          var q=0;
          for(var d=0;d<response.data.length;d++) {
              if (participantsEmailIds.indexOf(response.data[d].emailId) == -1) {
                  newOne[q] =  response.data[d];
                  q++;
              }
          }
          response.data = new Array();
          response.data = newOne;
          return response.data.map(function(item){
                  return item.emailId;
          });

      });
    };
    $scope.addParticipant = function(prospect_id){
      console.log("addParticipant in cntrlr: "+$scope.asyncSelected+" "+prospect_id);
      participant.addParticipant($scope.asyncSelected, prospect_id);
      $scope.asyncSelected = null;
      $scope.fetchList();
    };

        $scope.deleteParticipant = function(participantId, name, prospectId) {

            if (confirm("Do you want to delete participant "+name) == true) {
                // todo code for deletion
                participant.deleteParticipant(participantId);
                $state.transitionTo('auth.prospect.view', {prospectId: prospectId});
            }
        }
  });
