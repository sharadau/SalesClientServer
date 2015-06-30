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
    .controller('AuthCtrl', function ($scope, auth, $state,store, UsersService) {
        $scope.auth = auth;
        UsersService.getUserForType(5)
            .success (function (data){
            $scope.adminUsers = data;
            $scope.auth.profile.role = '';
            for(var u=0;u<$scope.adminUsers.length;u++)
            {
                if($scope.adminUsers[u].emailId == $scope.auth.profile.name)
                {
                    $scope.auth.profile.role = "admin";
                    console.log("user is admin");
                    break;
                }
            }

        })
            .error (function (error){
            console.log (error);
        });

        //console.log($scope.auth);
        $scope.logout = function(){
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $state.go('auth.dashboard');
            window.location.reload();
        }
    });
