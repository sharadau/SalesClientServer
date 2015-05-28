'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.participant
 * @description
 * # participant
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
  .service('participant', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var participants = [];
    this.getParticipant = function (participantId) {
      var successCallback, errorCallback;
      var response = {
        success: function (callback) {successCallback = callback; return response;},
        error: function (callback) {errorCallback = callback; return response;}
      };
      console.log("participantId: " + participantId);
      $http.get(service_base_url+'/api/employees/'+participantId)
        .success(function(item){
          successCallback(item);
        })
        .error(function(error){
          if (error) {
            errorCallback({msg: 'No participant with: ' + participantId + ' id'});
          }
        });

      return response;
    };

    this.getParticipantForProspect = function (participantId) {
      var successCallback, errorCallback;
      var response = {
        success: function (callback) {successCallback = callback; return response;},
        error: function (callback) {errorCallback = callback; return response;}
      };
      console.log("getParticipantForProspect prospectId: " + participantId);
     // $http.get('http://localhost:3000/api/employees/prospect/'+participantId)
        $http.get(service_base_url+'/api/participants/prospect/'+participantId)
        .success(function(item){
          successCallback(item);
        })
        .error(function(error){
          if (error) {
            errorCallback({msg: 'No participant with: ' + participantId + ' id'});
          }
        });

      return response;
    };
        this.getProspectForParticipantTechnology = function (searchVal) {
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };
            console.log("getProspectForParticipantTechnology prospectId: " + searchVal.name + " "+searchVal.technology);
            // $http.get('http://localhost:3000/api/employees/prospect/'+participantId)
            $http.get(service_base_url+'/api/participants/name/'+searchVal.name)
                .success(function(item){
                    successCallback(item);
                })
                .error(function(error){
                    if (error) {
                        errorCallback({msg: 'No prospect with: ' + searchVal.name});
                    }
                });

            return response;
        };

    this.addParticipant = function(name, prospect_id) {
      var newParticipant={};
      console.log("name: "+name+" prospect_id: "+prospect_id);
      newParticipant.prospect_id = prospect_id ;
      newParticipant.name = name ;
      newParticipant.email = "sharada.umarane@gmail.com" ;
      newParticipant._id = getUniqueTime();
      $http.post(service_base_url+'/api/participants', newParticipant)
        .success(function (item) {
          participants.push(item);
          console.log("Added participant "+name);
        })
        .error(function (error) {
          if (error) {
        	  console.log(error);
            errorCallback(error);
          }
        });
      this.getParticipantForProspect(prospect_id);
    };

    this.deleteParticipant = function(pId) {
      $http.delete(service_base_url+'/api/employees/'+pId)
        .success(function (item) {var idx = getParticipantIndex (participants, '' + pId);
          if (idx !== -1) {
            participants.splice(idx, 1);
          }
        })
        .error(function (error) {
          if (error) {
            errorCallback(error);
          }
        });
    };

    this.updateParticipant = function(newParticipant) {
      console.log("inputs:");
      console.log(newParticipant);

      $http.put(service_base_url+'/api/projects/' + newParticipant._id, newParticipant)
        .success(function (item) {
          var idx = getParticipantIndex(participants, '' + newParticipant._id);
          if (idx !== -1) {
            participants[idx] = item;
          }
        })
        .error(function (error) {
          if (error) {
            console.log(error);
          }
        });

    };

    this.getParticipantByName = function (participant, name) {
      if (!participant) {
        return undefined;
      }
      var len = participants.length;
      for (var idx = 0; idx < len; idx++) {
        if (participants[idx].name === name) {
          return participants[idx];
        }
      }
      if (len > 0) {
        return participants[0];
      }
      return undefined;
    };


    var getParticipantIndex = function (prospects, prospectId) {
      var len = prospects.length;
      for (var idx = 0; idx < len; idx++) {
        if ('' + prospects[idx]._id === prospectId) {
          return idx;
        }
      }
      return -1;
    };
  });
	