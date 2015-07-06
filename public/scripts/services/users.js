'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.participant
 * @description
 * # participant
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
  .service('UsersService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var users = [];
    this.getUserForType = function (type) {
      var successCallback, errorCallback;
      var response = {
        success: function (callback) {successCallback = callback; return response;},
        error: function (callback) {errorCallback = callback; return response;}
      };
      console.log("user type: " + type);
      $http.get(service_base_url+'/api/users/user_type/'+type)
        .success(function(item){
          successCallback(item);
        })
        .error(function(error){
          if (error) {
            errorCallback({msg: 'No user with: ' + type + ' type'});
          }
        });

      return response;
    };
        this.getUsers = function () {
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };
            $http.get(service_base_url+'/api/users/')
                .success(function(item){
                    successCallback(item);
                })
                .error(function(error){
                    if (error) {
                        errorCallback({msg: 'No user exists'});
                    }
                });

            return response;
        };


    this.addUser = function(name, area, email, type) {
      var newUser={};
      console.log("name: "+name+" area: "+area+" email:"+email);
        newUser.name = name ;
        newUser.emailId = email ;
        newUser._id = getUniqueTime();
        newUser.user_type = type;
        newUser.area = area;
      $http.post(service_base_url+'/api/users', newUser)
        .success(function (item) {
          users.push(item);
          console.log("Added Sales Person "+name);
        })
        .error(function (error) {
          if (error) {
        	  console.log(error);
            errorCallback(error);
          }
        });
    //  this.getParticipantForProspect(prospect_id);
    };
        this.addAdmin = function(name, email) {
            var newUser={};
            console.log("name: "+name+" email: "+email);
            newUser.name = name ;
            newUser.emailId = email ;
            newUser._id = getUniqueTime();
            newUser.user_type = 5;
            newUser.area = '';
            $http.post(service_base_url+'/api/users/', newUser)
                .success(function (item) {
                    users.push(item);
                    console.log("Added admin "+name);
                })
                .error(function (error) {
                    if (error) {
                        console.log(error);
                        errorCallback(error);
                    }
                });
            //  this.getParticipantForProspect(prospect_id);
        };

    this.deleteUser = function(id) {
      $http.delete(service_base_url+'/api/users/'+id)
        .success(function (item) {var idx = getParticipantIndex (users, '' + id);
          if (idx !== -1) {
            users.splice(idx, 1);
          }
        })
        .error(function (error) {
          if (error) {
            errorCallback(error);
          }
        });
    };
this.getUserByEmailId = function(id) {
    var successCallback, errorCallback;
    var response = {
        success: function (callback) {successCallback = callback; return response;},
        error: function (callback) {errorCallback = callback; return response;}
    };
    $http.get(service_base_url+'/api/users/emailId/'+id)
        .success(function(item){
            successCallback(item);
        })
        .error(function(error){
            if (error) {
                errorCallback({msg: 'No user with: ' + id + ' id'});
            }
        });

    return response;
};
    var getParticipantIndex = function (users, prospectId) {
      var len = users.length;
      for (var idx = 0; idx < len; idx++) {
        if ('' + users[idx]._id === prospectId) {
          return idx;
        }
      }
      return -1;
    };
  });
	