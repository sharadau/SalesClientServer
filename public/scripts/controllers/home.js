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

        $scope.searchProspect = function (searchVal) {

            participant.getProspectForParticipantTechnology(searchVal)
                .success(function (data) {
                    console.log("participant: "+JSON.stringify(data));
                    $scope.count = 0;
                    $scope.searchResult = new Array();
                    for(var i=0;i<data.length;i++)
                    {
                        console.log("prospect id: "+JSON.stringify(data[i].prospect_id));
                        ProspectService.getProspect(data[i].prospect_id)

                            .success(function (data1) {
                                $scope.searchResult[$scope.count] = {};
                                $scope.searchResult[$scope.count].name = data1.name;
                                $scope.searchResult[$scope.count]._id = data[$scope.count].prospect_id;
                                $scope.searchResult[$scope.count].state = data1.state;
                                $scope.count++;
                            }).error(function (error) {
                                console.log(error.msg);
                            }
                        );
                    }

                })
                .error(function (error) {
                    console.log(error.msg);
                }
            );

        };


  });

