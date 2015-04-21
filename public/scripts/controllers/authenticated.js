/**
 * Created by sujatah on 3/24/2015.
 */
'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:EmployeesCtrl
 * @description
 * # EmployeesCtrl
 * Controller of the dashboardApp
 */
angular.module('dashboardApp')
    .controller('AuthCtrl', function ($scope, auth, $state,store) {
        $scope.auth = auth;
        //console.log($scope.auth);
        $scope.logout = function(){
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $state.go('login');
        }
    });
