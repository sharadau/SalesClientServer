'use strict';

/**
 * @ngdoc service
 * @name dashboardApp.dashboard
 * @description
 * # dashboard
 * Service in the dashboardApp.
 */



angular.module('dashboardApp')
  .service('dashboardService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

        var yearlyStats = {converted: [150, 145, 153, 150, 158,22,34,123,444,22,12,23], active: [58, 63, 55, 59, 52,12,34,222,56,65,34,88]};


        this.getYearlyStats = function () {
            var yearlyStats1 = [yearlyStats.converted,yearlyStats.active];
            return yearlyStats1;
        };

    });
