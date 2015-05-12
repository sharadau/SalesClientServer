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

          console.log("email sts:"+newProspect.sendEmail);
      //send email
        if(newProspect.sendEmail)
      	  {
      	  	console.log("Send email on");
      	    var newEmail = {};
              var subject = "Presale Prospect: "+newProspect.name;
              var from = email_from;
              var from_name = email_from;
      	      newEmail.send_date = new Date().toDateString();
      	      newEmail.to = presale_email_id;
              newEmail.contents = subject + " is initialized." + " \r\nProspect Description: "+newProspect.description + " \r\nComments: "+ newProspect.othercomments;
      	    Emails.sendEmail(newEmail, from, from_name, subject, newProspect._id,1);
      	  }
      }
      $state.transitionTo('auth.prospect.view', {prospectId: newProspect._id});
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
