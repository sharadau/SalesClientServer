'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:ParticipantListCtrl
 * @description
 * # ParticipantListCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('ParticipantListCtrl', function ($scope, $state, $stateParams, $http, participant,Emails, auth,PrivilegesService, UsersService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  $scope.prospect_id = $stateParams.prospectId;
  $scope.prospect_name = $stateParams.prospectName;
        //get privilages for user type
        //check user privilages
        $scope.auth.profile.prospectPrivilage = [];
        // $scope.auth.profile.privilage = [];

        $scope.getPrivilagesForUserTypev = function(type){
            //get privilages for user type
            PrivilegesService.getPrivilegesForType(type)
                .success (function (data1) {
                if(typeof data1 == 'object') {
                    $scope.auth.profile.prospectPrivilage = [];
                    for (var p = 0; p < data1.length; p++) {
                        $scope.auth.profile.prospectPrivilage[p] = data1[p].functionality;
                    }
                }
                console.log("participant list: privilages:"+JSON.stringify( $scope.auth.profile.prospectPrivilage));
            }).error (function (error){
                console.log (error);
            });
        };
        UsersService.getUserByEmailId($scope.auth.profile.name)
            .success (function (data) {
            $scope.userDetails = data;

            if(data.user_type == 1)
            {
                $scope.auth.profile.userType = 'sales_person';
            }else if(data.user_type == 5)
            {
                $scope.auth.profile.userType = 'admin';
            }else if(data.user_type == 2)
            {
                $scope.auth.profile.userType = 'participant';
            }else if(data.user_type == 3)
            {
                $scope.auth.profile.userType = 'others';
            }else if(data.user_type == 4)
            {
                $scope.auth.profile.userType = 'outsiders';
            }else if(data.user_type == 6)
            {
                $scope.auth.profile.userType = 'CEO_CTO';
            }
        if($scope.auth.profile.userType != 'CEO_CTO' && $scope.auth.profile.userType != 'admin') {

            var isParticipant = false;
            var isInitiated = false;

            //check if user is involved in prospect
            participant.getParticipantForProspect($stateParams.prospectId)
                .success(function (data3) {
                    for (var u = 0; u < data3.length; u++) {
                        console.log("compare: "+data3[u].email+" "+$scope.auth.profile.name);
                        if(data3[u].email == $scope.auth.profile.name )
                        {
                            console.log("user is participant with type "+$scope.auth.profile.userType);
                            //  alert("user is participant with type " + $scope.auth.profile.userType);
                            isParticipant = true;
                            if(data3[u].initiatedProspect == '1')
                            {
                                console.log("user is participant with type "+$scope.auth.profile.userType);
                                // alert("user initiated this prospect with type " + $scope.auth.profile.userType);
                                isInitiated = true;
                            }
                        }
                    }
                    $scope.auth.profile.prospectUserType = $scope.auth.profile.userType;
                    if(isParticipant == true && isInitiated == false && $scope.auth.profile.userType != 'admin') {
                        $scope.auth.profile.prospectUserType = 'participant';
                    }else if(isParticipant == false && $scope.auth.profile.userType != 'admin') {
                        //alert("user is not participant and type " + $scope.auth.profile.userType + " so he will be treated as others");
                        console.log("user is not participant and type " + $scope.auth.profile.userType + " so he will be treated as others");
                        $scope.auth.profile.prospectUserType = "others";
                    }

                    PrivilegesService.getPrivilegesForType($scope.auth.profile.prospectUserType)
                        .success(function (data2) {
                            console.log("typeof data2:"+typeof data2);
                            console.log("data2:"+JSON.stringify( data2));
                            $scope.auth.profile.prospectPrivilage = [];
                            if(typeof data2 == 'object') {
                                for (var p = 0; p < data2.length; p++) {
                                    $scope.auth.profile.prospectPrivilage[p] = data2[p].functionality;
                                }
                            }
                            console.log("prospect view privilages11:" + JSON.stringify($scope.auth.profile.prospectPrivilage));
                        }).error(function (error) {
                            console.log(error);
                        });
                }).error(function (error) {
                    console.log(error);
                });


        }else
        {
            $scope.getPrivilagesForUserTypev($scope.auth.profile.userType);

        }
    }).error (function (error){
    console.log ("prospect user privilages error:"+JSON.stringify(error));
    console.log("prospect privilages:"+JSON.stringify( $scope.auth.profile.prospectPrivilage));
});

console.log("prospect privilages11:" + JSON.stringify($scope.auth.profile.prospectPrivilage));

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
               // $state.transitionTo('auth.prospect.view', {prospectId: prospectId});
                window.location.reload();
            }
        }
  });
