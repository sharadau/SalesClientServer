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
        this.getUncategorizedEmails = function () {
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };

            $http.get(service_base_url+'/api/emails/ulist/')
                .success(function(item){
                    successCallback(item);

                })
                .error(function(error){
                    if (error) {
                        console.log(error);
                        errorCallback({msg: 'No uncategorized emails'});
                    }
                });

            return response;
        };
        this.getUncategorizedEmailsForProspect = function (prospect_id) {

            //prospect_id = 1;
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };

            $http.get(service_base_url+'/api/emails/view/'+prospect_id)
                .success(function(item){
                    successCallback(item);

                })
                .error(function(error){
                    if (error) {
                        console.log(error);
                        errorCallback({msg: 'No uncategorized emails with prospect id ' + prospect_id });
                    }
                });

            return response;
        };

        this.sendEmail = function(newEmail, from, from_name, subject, prospect_id, stage) {

            //add prospect to nodejs server
            newEmail.stage = stage;
            newEmail.subject = subject;
            newEmail.from = from;
            newEmail.from_name = from_name;
            newEmail.to = newEmail.to;//"sharada.umarane@synerzip.com";
            newEmail.message = newEmail.contents + "\r\n\r\nPlease note this email is generated using Presales Dashboard.";
            newEmail.prospect_id = prospect_id;
            newEmail.cc = presale_email_cc_id;
            newEmail.cycle_no = newEmail.cycle_no;
            newEmail.cycle_id = newEmail.cycle_id;
            newEmail.send_date = new Date().toLocaleString();

            console.log("newemail:"+JSON.stringify(newEmail));
            console.log("cycle no in email:"+(newEmail.cycle_no));
            console.log("cycle in email:"+(newEmail.cycle_id));
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


        this.updateEmail = function (email_id, prospect_id, stage, prospect_cycle_id, prospect_cycle_no) {
console.log("update email:"+email_id+" stage:"+stage + "pid:"+prospect_id+" cycle:"+prospect_cycle_id);
            console.log("pid typeof:"+ typeof prospect_id);
            //prospect_id = 1;
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };
            var emails = {};
            emails.stage = stage;
            if(typeof prospect_id == 'number') {
                emails.prospect_id = prospect_id;
                emails.cycle_id = prospect_cycle_id;
                emails.cycle_no = prospect_cycle_no;
            }
            $http.put(service_base_url+'/api/emails/update/'+email_id,emails)
                .success(function(item){
                    successCallback(item);

                })
                .error(function(error){
                    if (error) {
                        console.log(error);
                        errorCallback({msg: 'No emails with email id ' + email_id });
                    }
                });

            return response;
        };

    });
