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
console.log("prospect id in participant list controller: "+$scope.prospect_id);
console.log("prospect name in participant list controller: "+$scope.prospect_name);
  $scope.fetchList = function(){
    participant.getParticipantForProspect($stateParams.prospectId)
      .success (function (data){
      $scope.participants = data;
      //console.log("Participants: "+$scope.participants)
    })
      .error (function (error){
      console.log (error);
    });
  }
    $scope.fetchList();
    /*$scope.participants = [
      {name: "Subu Sankara",_id:"1"},
      {name: "Rohit Ghatol",_id:"2"},
      {name: "Ashish Shanker",_id:"3"},
      {name: "Ashutosh Kumar",_id:"4"}
    ];*/
    // Any function returning a promise object can be used to load values asynchronously
    $scope.getEmployees = function(val) {
      return $http.get(service_base_url+'/api/employees/name/'+val, {
      }).then(function(response){
          console.log(response.data);
        return response.data.map(function(item){
         return item.name;
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
