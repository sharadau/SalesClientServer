'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.participant
 * @description
 * # participant
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
  .service('PrivilegesService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var privilages = [];
    this.getPrivilegesForType = function (type) {
      var successCallback, errorCallback;
      var response = {
        success: function (callback) {successCallback = callback; return response;},
        error: function (callback) {errorCallback = callback; return response;}
      };
      console.log("user type: " + type);
      $http.get(service_base_url+'/api/privilages/usertype/'+type)
        .success(function(item){
          successCallback(item);
        })
        .error(function(error){
          if (error) {
            errorCallback({msg: 'No privilages with: ' + type + ' type'});
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
	