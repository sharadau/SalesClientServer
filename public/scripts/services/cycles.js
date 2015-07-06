/**
 * Created by sharadau on 15-06-2015.
 */

'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.participant
 * @description
 * # participant
 * Service in the dashboardApp.
 */
angular.module('dashboardApp')
    .service('CyclesService', function ($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var cycles = [];
        this.getCycle = function (cycleId) {
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };
            $http.get(service_base_url+'/api/cycles/'+cycleId)
                .success(function(item){
                    successCallback(item);
                })
                .error(function(error){
                    if (error) {
                        errorCallback({msg: 'No cycle with: ' + cycleId + ' id'});
                    }
                });

            return response;
        };

        this.getCycleForProspect = function (prospectId) {
            var successCallback, errorCallback;
            var response = {
                success: function (callback) {successCallback = callback; return response;},
                error: function (callback) {errorCallback = callback; return response;}
            };
            $http.get(service_base_url+'/api/cycles/prospect/'+prospectId)
                .success(function(item){
                    successCallback(item);
                })
                .error(function(error){
                    if (error) {
                       // errorCallback({msg: 'No prospect with: ' + prospectId + ' id'});
                        console.log(error);
                    }
                });

            return response;
        };
            this.addCycle = function(newcycle, prospect_id) {
            $http.post(service_base_url+'/api/cycles', newcycle)
                .success(function (item) {
                    participants.push(item);
                })
                .error(function (error) {
                    if (error) {
                        console.log(error);
                        errorCallback(error);
                    }
                });
            //this.getCycleForProspect(prospect_id);
        };

       /* this.deleteParticipant = function(pId) {
            $http.delete(service_base_url+'/api/participants/'+pId)
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
        };*/

        this.updatecycle = function(newCycle) {
            console.log(newCycle);

            $http.put(service_base_url+'/api/cycles/' + newCycle._id, newCycle)
                .success(function (item) {
                    var idx = getCycleIndex(cycles, '' + newCycle._id);
                    if (idx !== -1) {
                        cycles[idx] = item;
                    }
                })
                .error(function (error) {
                    if (error) {
                        console.log("Error:"+error);
                    }
                });

        };


        var getCycleIndex = function (cycles, cycleId) {
            var len = cycles.length;
            for (var idx = 0; idx < len; idx++) {
                if ('' + cycles[idx]._id === cycleId) {
                    return idx;
                }
            }
            return -1;
        };
    });

