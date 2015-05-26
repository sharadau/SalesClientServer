'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('HomeCtrl', function ($scope, ProspectService, Emails, participant) {
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
        $scope.count = 0;
        for(var i=0;i< $scope.prospects.length;i++) {
            //console.log("email for prospect:" + $scope.prospects[i]._id);
            console.log("email for prospect:"+$scope.prospects[i]._id);
          var emailList =  Emails.getUncategorizedEmailsForProspect($scope.prospects[i]._id)
                .success(function (data1) {
                  $scope.prospects[$scope.count].no_of_emails = data1.length;
                    $scope.count++;
            })
                .error(function (error) {
                    console.log(error.msg);
                }
            );


        }
    })
      .error (function (error){
      console.log (error);
    });

        $scope.searchProspect = function (newProspect) {

            participant.getParticipantByName(newProspect.name)
                .success(function (data) {
                    console.log("particiapnts by name: "+data);
                })
                .error(function (error) {
                    console.log(error.msg);
                }
            );

        };


  });

