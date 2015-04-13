'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:ProspectEditCtrl
 * @description
 * # ProspectEditCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('ProspectEditCtrl', function ($scope, $state, $stateParams, ProspectService, Emails) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    if($stateParams.prospectId)
    {
    	ProspectService.getProspect($stateParams.prospectId)    
      .success (function (data){
      $scope.prospect = data;
      console.log(data);
      $scope.newProspect = JSON.parse(JSON.stringify($scope.prospect));
    })
      .error (function (error){
      console.log (error.msg);});
    }
    
    $scope.updateProspect = function (newProspect) {
      newProspect = newProspect || {};

      $scope.newProspect = {};

      if(newProspect._id) {
        ProspectService.updateProspect(newProspect);
      }else
      {
    	  
        newProspect._id = getUniqueTime();
        ProspectService.addProspect(newProspect);
        
      //send email
        if(newProspect.sendEmail)
      	  {
      	  	console.log("Send email on");
      	    var newEmail = {};
      	    newEmail.send_date = new Date().toDateString();
      	   // newEmail.from = "Mahesh";
      	    //newEmail.subject = "Mahesh";
      	    newEmail.contents = "Mahesh";
      	    newEmail.to = "Mahesh";
      	    
      	    Emails.sendEmail(newEmail, "Mahesh", "Presale Prospect "+newProspect.name, newProspect._id,1);
      	  }
      }
      $state.transitionTo('prospect.view', {prospectId: newProspect._id});
     // $state.transitionTo('prospect.view', {prospectId: 2});
    };

    $scope.cancelUpdate = function() {
      $scope.newProspect = JSON.parse(JSON.stringify($scope.prospect));

    };
    $scope.addUniqueItem = function (collection, item) {
      collection = collection || [];
      if (-1 === collection.indexOf(item)) {
        collection.push(item);
      }
    };
  });
