'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.participant
 * @description
 * # participant
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
  .service('EmployeeService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var employees = [];

        this.getEmployees = function () {
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };
            $http.get(service_base_url+'/api/employees/')
                .success(function(item){
                    successCallback(item);
                })
                .error(function(error){
                    if (error) {
                        errorCallback({msg: 'No employee exists'});
                    }
                });

            return response;
        };


    this.addEmployee = function(name, email) {
      var newUser={};
      console.log("name: "+name+" email:"+email);
        newUser.name = name ;
        newUser.emailId = email ;
        newUser._id = getUniqueTime();
      $http.post(service_base_url+'/api/employees', newUser)
        .success(function (item) {
              employees.push(item);
          console.log("Added Employee "+name);
        })
        .error(function (error) {
          if (error) {
        	  console.log(error);
            errorCallback(error);
          }
        });
    //  this.getParticipantForProspect(prospect_id);
    };

    this.deleteEmployee = function(id) {
      $http.delete(service_base_url+'/api/employees/'+id)
        .success(function (item) {var idx = getParticipantIndex (employees, '' + id);
          if (idx !== -1) {
              employees.splice(idx, 1);
          }
        })
        .error(function (error) {
          if (error) {
            errorCallback(error);
          }
        });
    };

    var getParticipantIndex = function (employees, prospectId) {
      var len = employees.length;
      for (var idx = 0; idx < len; idx++) {
        if ('' + employees[idx]._id === prospectId) {
          return idx;
        }
      }
      return -1;
    };
  });
	