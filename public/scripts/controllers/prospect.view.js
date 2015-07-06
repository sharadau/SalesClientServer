'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:ProspectViewCtrl
 * @description
 * # ProspectViewCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('ProspectViewCtrl', function ($scope, $stateParams, $state, $parse, $upload,$sce, ProspectService, Emails, auth, participant, CyclesService, PrivilegesService, UsersService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

        $scope.textAreas1=[];
        $scope.textAreas2=[];
        $scope.textAreas3=[];
        $scope.textAreas4=[];
        $scope.textAreas5=[];
        ProspectService.getProspect($stateParams.prospectId)
            .success (function (data){
            $scope.prospect = data;
            // $scope.prospect.participants = "sharada.umarane@synerzip.com";
            if(typeof $scope.prospect.questionsDoc != 'string')
            {
                $scope.prospect.questionsDoc = "";
            }

            for(var k=0;k<$scope.prospect.notes1.length;k++)
            {
                $scope.textAreas1.push({textBox:$scope.prospect.notes1[k]});
            }
            for(var k=0;k<$scope.prospect.notes2.length;k++)
            {
                $scope.textAreas2.push({textBox:$scope.prospect.notes2[k]});
            }
            for(var k=0;k<$scope.prospect.notes3.length;k++)
            {
                $scope.textAreas3.push({textBox:$scope.prospect.notes3[k]});
            }
            for(var k=0;k<$scope.prospect.notes4.length;k++)
            {
                $scope.textAreas4.push({textBox:$scope.prospect.notes4[k]});
            }
            for(var k=0;k<$scope.prospect.notes5.length;k++)
            {
                $scope.textAreas5.push({textBox:$scope.prospect.notes5[k]});
            }
            $scope.newProspect = JSON.parse(JSON.stringify($scope.prospect));

        })
            .error (function (error){
            console.log (error.msg);});

        //get privilages for user type
        //check user privilages
        $scope.auth.profile.prospectPrivilage = [];
       // $scope.auth.profile.privilage = [];
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

            //alert("user type:" + $scope.auth.profile.userType);
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
                           // alert("user is participant with type " + $scope.auth.profile.userType);
                            isParticipant = true;
                            if(data3[u].initiatedProspect == '1')
                            {
                                console.log("user is participant with type "+$scope.auth.profile.userType);
                              //  alert("user initiated this prospect with type " + $scope.auth.profile.userType);
                                isInitiated = true;
                            }
                        }
                    }
                        $scope.auth.profile.prospectUserType = $scope.auth.profile.userType;
                    if(isParticipant == true && isInitiated == false && $scope.auth.profile.userType != 'admin') {
                        $scope.auth.profile.prospectUserType = 'participant';
                    }else if(isParticipant == false && $scope.auth.profile.userType != 'admin') {
                       // alert("user is not participant and type " + $scope.auth.profile.userType + " so he will be treated as others");
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
                                console.log("prospect privilages11:" + JSON.stringify($scope.auth.profile.prospectPrivilage));
                            }).error(function (error) {
                                console.log(error);
                            });
                        }).error(function (error) {
                            console.log(error);
                        });


        }else
        {
            $scope.auth.profile.prospectPrivilage = $scope.auth.profile.privilage;
        }
        }).error (function (error){
            console.log ("prospect user privilages error:"+JSON.stringify(error));
            console.log("prospect privilages:"+JSON.stringify( $scope.auth.profile.prospectPrivilage));
        });
        console.log("prospect privilages11:" + JSON.stringify($scope.auth.profile.prospectPrivilage));

        //fetch participants
        $scope.fetchParticipantList = function(){
            participant.getParticipantForProspect($stateParams.prospectId)
                .success (function (data){
                $scope.participants = '';
                for(var i=0;i<data.length;i++)
                {
                    $scope.participants += data[i].email + ",";
                }
                $scope.participants = $scope.participants.substr(0,$scope.participants.length-1);
                $scope.newEmail = {
                    to: $scope.participants
                }
            })
                .error (function (error){
                console.log (error);
            });
        }
        //fetch participants for this prospect
        $scope.fetchParticipantList();
        $scope.addMore=function(stage){
            if(stage == '1')
            {
                $scope.textAreas1.push({textBox:""});

            }else if(stage == '2')
            {
                $scope.textAreas2.push({textBox:""});
            }else if(stage == '3')
            {
                $scope.textAreas3.push({textBox:""});
            }else if(stage == '4')
            {
                $scope.textAreas4.push({textBox:""});
            }else if(stage == '5')
            {
                $scope.textAreas5.push({textBox:""});
            }

        }
        $scope.sendNotesEmail=function(item, pname, prospectId,stage_id,stage){


            console.log("stage:"+stage);
            console.log("item:"+item.textBox);
            console.log("to:"+$scope.participants);
            //send note as email
            var newEmail = {};
            var subject = "Presale Prospect: Notes for prospect "+pname + " For stage "+stage;
            var from = auth.profile.name;
            var from_name = auth.profile.name;
            var d = new Date();
            newEmail.send_date = d.toLocaleString();
            newEmail.to = $scope.participants;
            console.log($scope.participants);
            if(confirm("Are you sure to send email to below participants:"+$scope.participants)==true) {
                newEmail.contents = "Note: " + " \r\n" + item.textBox;
                Emails.sendEmail(newEmail, from, from_name, subject, prospectId, stage_id);
                alert("Note as Email Sent Successfully!");
            }

        }
        $scope.SaveNotes=function(prospectId,stage){
            var notes = new Array();
            var sender = auth.profile.name;

            if(stage=='1') {
                for (var i = 0; i < $scope.textAreas1.length; i++) {
                    console.log($scope.textAreas1[i].textBox);
                    //notes[i] = $scope.textAreas1[i].textBox + "\n\r" + "-" + sender;
                    notes[i] = $scope.textAreas1[i].textBox;
                }
            }
            if(stage=='2') {
                for (var i = 0; i < $scope.textAreas2.length; i++) {
                    console.log($scope.textAreas2[i].textBox);
                    notes[i] = $scope.textAreas2[i].textBox;
                }
            }
            if(stage=='3') {
                for (var i = 0; i < $scope.textAreas3.length; i++) {
                    console.log($scope.textAreas3[i].textBox);
                    notes[i] = $scope.textAreas3[i].textBox;
                }
            }
            if(stage=='4') {
                for (var i = 0; i < $scope.textAreas4.length; i++) {
                    console.log($scope.textAreas4[i].textBox);
                    notes[i] = $scope.textAreas4[i].textBox;
                }
            }
            if(stage=='5') {
                for (var i = 0; i < $scope.textAreas5.length; i++) {
                    console.log($scope.textAreas5[i].textBox);
                    notes[i] = $scope.textAreas5[i].textBox;
                }
            }

            //update notes
            ProspectService.saveNotes(prospectId, notes, stage);

        }
        //$scope.newProspect = {};
        $scope.fileSelection = function($files){
           // $files[0].name = $files[0].name + Date.now();
            //console.log("file name updated:"+Date.now());
            $scope.uploadFiles = $files;
        };
        $scope.onFileSelect = function($files, newProspect) {
            //$files: an array of files selected, each file has name, size, and type.
            console.log("files:"+$files);
            if(typeof $files == 'object') {
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    $scope.upload = $upload.upload({
                        url: service_base_url + '/api/fileupload', //upload.php script, node.js route, or servlet url
                        //url: 'htt://localhost:63342/Phantom-Server/public/', //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        //headers: {'header-key': 'header-value'},
                        //withCredentials: true,
                        data: {myObj: file.name},
                        file: file // or list of files ($files) for html5 only
                        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                        // customize file formData name ('Content-Desposition'), server side file variable name.
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                        //formDataAppender: function(formData, key, val){}
                    }).progress(function (evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(newProspect);
                        //$scope.newProspect.uploadStatus.value = "File uploaded successfully!!!";
                        console.log("uploaded file name:" + data);
                    }).error(function (err) {
                        // file failed to upload
                        console.log("upload error" + err);
                    });
                    //.error(...)
                    //.then(success, error, progress);
                    // access or attach event listeners to the underlying XMLHttpRequest.
                    //.xhr(function(xhr){xhr.upload.addEventListener(...)})
                }
            }
            /* alternative way of uploading, send the file binary with the file's content-type.
             Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
             It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };



    $scope.deleteProspect = function(prospectId, name) {
    	
    	if (confirm("Do you want to delete prospect "+name) == true) {
            // todo code for deletion    
		      ProspectService.deleteProspectById(prospectId);
              $state.transitionTo('auth.home');
            window.location.reload();
    	}
    }
    
    //retrieve emails for stage1
    Emails.getEmailsForProspectStage($stateParams.prospectId, "1")
    .success (function (data){
    $scope.emailsForStage1 = data;

  })
    .error (function (error){
    console.log (error.msg);});

        $scope.acceptProspect = function(newProspect, prospectId, stage, stage_id, cycle_id) {

            $scope.onFileSelect($scope.uploadFiles, newProspect);

            var fileN = '';
            if(typeof $scope.uploadFiles == 'object' )
            {
                fileN = $scope.uploadFiles[0].name;
            }
           // ProspectService.updateStage(prospectId, stage, stage_id);
            ProspectService.ClosureDetails(prospectId, stage, stage_id, newProspect.closureNotes, fileN);
            $scope.prospect.state_id = stage_id;
            $scope.prospect.engagementLetter = fileN;
            //update cycle stage
            console.log("update cycle stage");
            var newCycle = {};
            newCycle.current_state = stage_id;
            newCycle._id = cycle_id;
            CyclesService.updatecycle(newCycle);
            window.location.reload();

        };
        $scope.addQuestions = function(newProspect, prospectId) {
            var filename = '';
            if((typeof $scope.uploadFiles) == 'object')
            {
                console.log("add question");
                $scope.onFileSelect($scope.uploadFiles, newProspect);
                filename = $scope.uploadFiles[0].name;
                $scope.prospect.questionsDoc = $scope.uploadFiles[0].name;
            }

            ProspectService.addQuestions(prospectId, newProspect.questions, filename);


        };
        $scope.rejectProspect = function(newProspect, prospectId, stage, stage_id, cycle_id) {

            newProspect = newProspect || {};

            $scope.newProspect = {};
            //console.log("notess:"+newProspect.closureNotes);

            ProspectService.ClosureDetails(prospectId, stage, stage_id, "closurenotes","");
            $scope.prospect.state_id = stage_id;
            //update cycle stage
            console.log("update cycle stage");
            var newCycle = {};
            newCycle.current_state = stage_id;
            newCycle._id = cycle_id;
            CyclesService.updatecycle(newCycle);
            window.location.reload();

        };
  $scope.markComplete = function(prospectId, stage, stage_id, cycle_id) {

        var markFlag = true;
        if(stage_id == 5 && $scope.emailsForStage3.length == 0)
        {
            if(confirm("Are u sure you want to complete this stage? Generally Internal Preparation completes after client call!") == false)
            {
                markFlag = false;
            }
        }
      if(markFlag == true) {
          ProspectService.updateStage(prospectId, stage, stage_id);

          //update cycle stage
          console.log("update cycle stage");
          var newCycle = {};
          newCycle.current_state = stage_id;
          newCycle._id = cycle_id;
          CyclesService.updatecycle(newCycle);
          $scope.prospect.state_id = stage_id;
          window.location.reload();
      }
	  };
        //retrieve cycles for stage1
        CyclesService.getCycleForProspect($stateParams.prospectId)
            .success (function (data){
            $scope.cycles = data;
            console.log("Cycles:"+JSON.stringify(data));

        })
            .error (function (error){
            console.log (error.msg);});

        $scope.completeCycle = function(cycle_no, cycle_id, prospectId, name) {
            console.log("update cycle");
            var newCycle = {};
            newCycle._id = cycle_id;
            var d = new Date();
            newCycle.end_date = d.toDateString();
            newCycle.status = "Complete";
            CyclesService.updatecycle(newCycle);
            // $scope.prospect.state_id = stage_id;

            //create new cycle
            console.log("create new cycle");
            var cycleNew = {};
            cycleNew._id = getUniqueTime();
            cycleNew.start_date = d.toDateString();
            cycleNew.status = "In Progress";
            cycleNew.prospect_id = prospectId;
            cycleNew.prospect = name;
            cycleNew.current_state = 1;
            cycleNew.cycle_no = cycle_no + 1;
            console.log("new cycle:" + JSON.stringify(cycleNew));
            console.log("no cycle:" + cycle_no);
            CyclesService.addCycle(cycleNew);

            //update prospect cycle
            console.log("update cycle in prospect");
            var newP = {};
            newP.cycle_no = cycleNew.cycle_no;
            newP.cycle_id = cycleNew._id;
            newP.state_id = 1;
            newP.state = "Initiation";
            newP._id = prospectId;

            ProspectService.updateProspect(newP);

            alert("cycle " + cycle_no + " is completed!");
            window.location.reload();
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


        //uncategorized emails
        //Emails.getUncategorizedEmailsForProspect($stateParams.prospectId)
        Emails.getEmailsForProspectStage($stateParams.prospectId,"0")
            .success (function (data){
            $scope.uncategorizedEmails = data;
            console.log("uncategorized emails:"+$scope.uncategorizedEmails);
            $scope.uncategorizedEmails.forEach(function (eml) {
                console.log("stage:"+eml.stage);
                console.log("subject:"+eml.subject);
            });

        })
            .error (function (error){
            console.log (error.msg);});

        $scope.renderHtml = function(html_code)
        {
            console.log("html:"+html_code);
            var changed_html = html_code.replace("\\n\\r","jjjjjjjjjjjjjjj");
            console.log("replaced html:"+changed_html);
            //return $sce.trustAsHtml(html_code);
            return (changed_html);
        };

    $scope.oneAtATime = true;

       $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  });
