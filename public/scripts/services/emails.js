'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.emails
 * @description
 * # emails
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
    .service('Emails', function ($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var emails = [];
        this.getEmailsForProspectStage = function (prospect_id, stage) {
           
            //prospect_id = 1;
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };
           
            $http.get(service_base_url+'/api/emails/'+prospect_id+'_'+stage)
                .success(function(item){
                    successCallback(item);

                })
                .error(function(error){
                    if (error) {
                        console.log(error);
                        errorCallback({msg: 'No emails with prospect id ' + prospect_id + ' for stage '+stage});
                    }
                });

            return response;
        };

        this.sendEmail = function(newEmail, from, subject, prospect_id, stage) {

            //add prospect to nodejs server
            newEmail.stage = stage;
            newEmail.subject = subject;
            newEmail.from = from;
            newEmail.to = newEmail.to;//"sharada.umarane@synerzip.com";
            newEmail.message = newEmail.contents;
            newEmail.prospect_id = prospect_id;
            newEmail.cc = presale_email_cc_id;
            newEmail.send_date = new Date().toLocaleString();

            $http.post(service_base_url+'/api/emails', newEmail)
                .success(function (item) {
                    emails.push(item);
                    console.log("Email sent successfully!!!");
                })
                .error(function (error) {
                    if (error) {
                        errorCallback(error);
                    }
                });
        };

    });
