'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:ProspectViewCtrl
 * @description
 * # ProspectViewCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('ProspectViewCtrl', function ($scope, $stateParams, ProspectService, Emails) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    //$stateParams.prospectId = 3;
    ProspectService.getProspect($stateParams.prospectId)
      .success (function (data){
      $scope.prospect = data;

    })
      .error (function (error){
      console.log (error.msg);});

    $scope.deleteProspect = function(prospectId, name) {
    	
    	if (confirm("Do you want to delete prospect "+name) == true) {
            // todo code for deletion    
		      ProspectService.deleteProspectById(prospectId) 
		      .success (function (data){
		    	  console.log(data);
		      })
		        .error (function (error){
		        console.log (error.msg);});
    	}
    }
    
    //retrieve emails for stage1
    Emails.getEmailsForProspectStage($stateParams.prospectId, "1")
    .success (function (data){
    $scope.emailsForStage1 = data;
    
  })
    .error (function (error){
    console.log (error.msg);});

        $scope.acceptProspect = function(newProspect, prospectId, stage, stage_id) {
            console.log(newProspect);
            //ProspectService.ClosureDetails(prospectId, stage, stage_id, notes, engagementLetter);
            $scope.stage_id = stage_id;

        };
  $scope.markComplete = function(prospectId, stage, stage_id) {
	    ProspectService.updateStage(prospectId, stage, stage_id);
	    $scope.stage_id = stage_id;
	   
	  };
  //stage2 email
  Emails.getEmailsForProspectStage($stateParams.prospectId, "2")
  .success (function (data){
  $scope.emailsForStage2 = data;

})
  .error (function (error){
  console.log (error.msg);});

//stage3 email
  Emails.getEmailsForProspectStage($stateParams.prospectId, "3")
  .success (function (data){
  $scope.emailsForStage3 = data;

})
  .error (function (error){
  console.log (error.msg);});

//stage4 email
  Emails.getEmailsForProspectStage($stateParams.prospectId, "4")
  .success (function (data){
  $scope.emailsForStage4 = data;

})
  .error (function (error){
  console.log (error.msg);});

//stage5 email
  Emails.getEmailsForProspectStage($stateParams.prospectId, "5")
  .success (function (data){
  $scope.emailsForStage5 = data;

})
  .error (function (error){
  console.log (error.msg);});

    $scope.oneAtATime = true;

       $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  });
