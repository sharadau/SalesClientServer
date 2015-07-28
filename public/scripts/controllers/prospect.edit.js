'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:ProspectEditCtrl
 * @description
 * # ProspectEditCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('ProspectEditCtrl', function ($scope, $state, $stateParams, ProspectService, Emails, auth, CyclesService, participant) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
        $scope.nameAvailable = 0;
    if($stateParams.prospectId)
    {
    	ProspectService.getProspect($stateParams.prospectId)    
      .success (function (data){
      $scope.prospect = data;
      console.log(data);
      $scope.newProspect = JSON.parse(JSON.stringify($scope.prospect));
            $scope.action = "edit";
    })
      .error (function (error){
      console.log (error.msg);});
    }else{
        $scope.action = "add";
    }
    
    $scope.updateProspect = function (newProspect) {
        if($scope.nameAvailable == 0)
        {
            alert("Please check Prospect name availability");
            return;

        }else if($scope.nameAvailable == 1){
            alert("Prospect name not available");
            return;
        }
      newProspect = newProspect || {};

      $scope.newProspect = {};

      if(newProspect._id) {
        ProspectService.updateProspect(newProspect);
      }else
      {

        newProspect._id = getUniqueTime();
          //create cycle
          var newCycle = {};
          newCycle._id = getUniqueTime();
          newProspect.cycle_id = newCycle._id;
          newProspect.cycle_no = 1;

          if(newProspect.sendEmail == true)
          {
              newProspect.state = "Internal Preparation";
              newProspect.state_id = 3;
          }else{
              newProspect.state = "Initiation";
              newProspect.state_id = 1;
          }
        ProspectService.addProspect(newProspect);

          if($scope.auth.profile.userType == 'sales_person') {
              //add participant
              console.log("adding salesperson as participant");
              participant.addSalesParticipant($scope.auth.profile.name, newProspect._id);
          }

          //create cycle
          //var newCycle = {};
          //newCycle._id = getUniqueTime();
          newCycle.cycle_no = 1;
          newCycle.status = "In progress";
          newCycle.prospect_id = newProspect._id;
          newCycle.prospect = newProspect.name;
          newCycle.current_state = newProspect.state_id;
          var d = new Date();
          newCycle.start_date = d.toDateString();
            CyclesService.addCycle(newCycle);

      //send email
        if(newProspect.sendEmail)
      	  {
      	    var newEmail = {};
              var subject = "Presale Prospect: "+newProspect.name;
              var from = auth.profile.name;
              var from_name = auth.profile.name;
              newEmail.send_date = d.toLocaleString();
      	      //newEmail.send_date = new Date().toDateString();
      	      newEmail.to = presale_alias_id;
      	      newEmail.cycle_no = 1;
      	      newEmail.cycle_id = newCycle._id;
              newEmail.contents = subject + " is initialized." + " \r\nProspect Description: "+newProspect.description + " \r\nComments: "+ newProspect.othercomments;
      	    Emails.sendEmail(newEmail, from, from_name, subject, newProspect._id,1);
      	  }
      }
      $state.transitionTo('auth.prospect.view', {prospectId: newProspect._id});
    };

    $scope.addUniqueItem = function (collection, item) {
      collection = collection || [];
      if (-1 === collection.indexOf(item)) {
        collection.push(item);
      }
    };
        $scope.cancelUpdate = function($event){
            $event.preventDefault();
            window.history.back();
        }
        document.getElementById("invalidEmail").style.display = "none";

        $scope.checkNameAvailable = function(name){
            if(name == '' || typeof name != 'string')
            {
                document.getElementById("invalidEmail").style.display = "none";
            }else {
                ProspectService.getProspectByProspectName(name)
                    .success(function (data) {
                    console.log("prospect found:" + data);

                    if (typeof data == 'object') {
                        document.getElementById("invalidEmail").innerHTML = "<label style='color:red'>Prospect name already exists</label>";
                        document.getElementById("invalidEmail").style.display = "block";
                        $scope.nameAvailable = 1;
                        $scope.newProspectForm.$valid = false;
                    } else {
                        document.getElementById("invalidEmail").innerHTML = "Prospect Name Available";
                        document.getElementById("invalidEmail").style.display = "block";
                        $scope.newProspectForm.$valid = true;
                        $scope.nameAvailable = 2;
                    }
                })
                    .error(function (error) {
                        console.log(error);
                    }
                );
            }

        }
        // Same validator as AngularJS's, only with a different RegExp.
       $scope.urlValidator = function(){
            //var URL_REGEXP = /^(?:http|ftp)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[\/?]\S+)$/gi;
            var URL_REGEXP = "(^(?:(?:.*?)?//)?[^/?#;]*)";
           var value = $scope.companyURL;
           console.log("url:"+value);
           alert("valid:"+URL_REGEXP.test(value));
            if ( URL_REGEXP.test(value)) {
               alert("valid"+URL_REGEXP.test(value));
            } else {
                alert("invalid");
            }
        };
  });
