'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:ProspectViewCtrl
 * @description
 * # ProspectViewCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
  .controller('ProspectViewCtrl', function ($scope, $stateParams, $parse, $upload,$sce, ProspectService, Emails, auth) {
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
        $scope.SaveNotes=function(prospectId,stage){
            var notes = new Array();
            var sender = auth.profile.name;

            if(stage=='1') {
                for (var i = 0; i < $scope.textAreas1.length; i++) {
                    console.log($scope.textAreas1[i].textBox);
                    notes[i] = $scope.textAreas1[i].textBox + "\n\r" + "-" + sender;
                }
            }
            if(stage=='2') {
                for (var i = 0; i < $scope.textAreas2.length; i++) {
                    console.log($scope.textAreas2[i].textBox);
                    notes[i] = $scope.textAreas2[i].textBox + "\n\r" + "-" + sender;
                }
            }
            if(stage=='3') {
                for (var i = 0; i < $scope.textAreas3.length; i++) {
                    console.log($scope.textAreas3[i].textBox);
                    notes[i] = $scope.textAreas3[i].textBox + "\n\r" + "-" + sender;
                }
            }
            if(stage=='4') {
                for (var i = 0; i < $scope.textAreas4.length; i++) {
                    console.log($scope.textAreas4[i].textBox);
                    notes[i] = $scope.textAreas4[i].textBox + "\n\r" + "-" + sender;
                }
            }
            if(stage=='5') {
                for (var i = 0; i < $scope.textAreas5.length; i++) {
                    console.log($scope.textAreas5[i].textBox);
                    notes[i] = $scope.textAreas5[i].textBox + "\n\r" + "-" + sender;
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
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: service_base_url+'/api/fileupload', //upload.php script, node.js route, or servlet url
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
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(newProspect);
                    //$scope.newProspect.uploadStatus.value = "File uploaded successfully!!!";
                    console.log("uploaded file name:"+data);
                }).error(function (err) {
                    // file failed to upload
                    console.log("upload error"+err);
                });
                //.error(...)
                //.then(success, error, progress);
                // access or attach event listeners to the underlying XMLHttpRequest.
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})
            }
            /* alternative way of uploading, send the file binary with the file's content-type.
             Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
             It could also be used to monitor the progress of a normal http post/put request with large data*/
            // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        };

        //$stateParams.prospectId = 3;
    ProspectService.getProspect($stateParams.prospectId)
      .success (function (data){
      $scope.prospect = data;
        $scope.prospect.participants = "sharada.umarane@synerzip.com";
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

           // newProspect = newProspect || {};

           // $scope.newProspect = {};
           // console.log("notes:"+notes);
            //console.log("notess:"+newProspect.closureNotes);
            //console.log(newProspect);
            $scope.onFileSelect($scope.uploadFiles, newProspect);

           // ProspectService.updateStage(prospectId, stage, stage_id);
            ProspectService.ClosureDetails(prospectId, stage, stage_id, newProspect.closureNotes, $scope.uploadFiles[0].name);
            $scope.prospect.state_id = stage_id;
            $scope.prospect.engagementLetter = $scope.uploadFiles[0].name;


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
        $scope.rejectProspect = function(newProspect, prospectId, stage, stage_id) {

            newProspect = newProspect || {};

            $scope.newProspect = {};
            //console.log("notess:"+newProspect.closureNotes);

            ProspectService.ClosureDetails(prospectId, stage, stage_id, "closurenotes","");
            $scope.prospect.state_id = stage_id;

        };
  $scope.markComplete = function(prospectId, stage, stage_id) {

	    ProspectService.updateStage(prospectId, stage, stage_id);
	    $scope.prospect.state_id = stage_id;
	   
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
