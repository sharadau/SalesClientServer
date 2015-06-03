'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:EmailsListCtrl
 * @description
 * # EmailsListCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('EmailsListCtrl', function ($scope,$stateParams, Emails, ProspectService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
   /* $scope.emails = [
      {subject: "Initied Yvolver",body:"New",_id:"1",date:"12/10/2014"},
      {subject: "Initied PayWize",body:"Internal Preparation",_id:"2",date:"02/10/2014"},
      {subject: " Initied CNM Connect",body:"Initiation",_id:"3",date:"12/12/2014"}
    ];*/

        $scope.prospect_id = $stateParams.prospect_id;
        //uncategorized emails
        Emails.getEmailsForProspectStage($stateParams.prospect_id, 0)
            .success (function (data){
            $scope.emails = data;
            //console.log("uncategorized emails:"+$scope.emails[0].stage);
           // $scope.emails.forEach(function (eml) {
              //  console.log("subject:"+eml.subject);
           // });
        })
            .error (function (error){
            console.log (error.msg);}
        );

        $scope.emailsSelected = new Array();

        $scope.selectEmail = function(email_id){
            $scope.emailsSelected[$scope.emailsSelected.length] = email_id;
        };
        $scope.moveEmail = function(){
            console.log("selected emails:"+(typeof $scope.emailsSelected));
            console.log("selected emails:"+( $scope.emailsSelected));
            console.log("selected stage:"+(typeof $scope.stage));
            console.log("selected stage:"+$scope.stage);

            //if(typeof $scope.stage == 'number' && typeof $scope.emailsSelected == 'object') {
            if(typeof $scope.stage == 'string') {
            for(var i=0;i<$scope.emailsSelected.length;i++)
            {
                //update emails
                Emails.updateEmail($scope.emailsSelected[i], '', $scope.stage )
                    .success (function (data){
                    console.log("Email is moved"+data);
                })
                    .error (function (error){
                        console.log (error.msg);}
                );
            }}else{
                alert("Please select Stage and Email!");
                return;
            }

            alert("Email moved");
            $scope.prospect = '';
            $scope.stage = '';
            //$scope.emailsSelected = new Array();
        };

    });
