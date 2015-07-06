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
    .controller('AuthCtrl', function ($scope, auth, $state, $stateParams, store, UsersService, PrivilegesService) {
        $scope.auth = auth;
        //check user privilages

        $scope.auth.profile.privilage = [];
        UsersService.getUserByEmailId($scope.auth.profile.name)
            .success (function (data) {
            $scope.userDetails = data;

            if(data.user_type == 1)
            {
                $scope.auth.profile.userType = 'sales_person';
            }else if(data.user_type == 5)
            {
                $scope.auth.profile.userType = 'admin';
            }else if(data.user_type == 2)
            {
                $scope.auth.profile.userType = 'participant';
            }else if(data.user_type == 3)
            {
                $scope.auth.profile.userType = 'others';
            }else if(data.user_type == 4)
            {
                $scope.auth.profile.userType = 'outsiders';
            }else if(data.user_type == 6)
            {
                $scope.auth.profile.userType = 'CEO_CTO';
            }
            $scope.getPrivilagesForUserType($scope.auth.profile.userType);

        }).error (function (error){
            console.log ("Error:"+JSON.stringify(error));

            //$scope.auth.profile.userType = 'others';
            $scope.getPrivilagesForUserType(others);
        });


        $scope.getPrivilagesForUserType = function(type){
            //get privilages for user type
            PrivilegesService.getPrivilegesForType(type)
                .success (function (data1) {
                if(typeof data1 == 'object') {
                    $scope.auth.profile.privilage = [];
                    for (var p = 0; p < data1.length; p++) {
                        $scope.auth.profile.privilage[p] = data1[p].functionality;
                    }
                }
                console.log("privilages:"+JSON.stringify( $scope.auth.profile.privilage));
            }).error (function (error){
                console.log (error);
            });
        };
        console.log("privilages:"+JSON.stringify( $scope.auth.profile.privilage));
        /*UsersService.getUserForType(5)
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
        });*/

        //console.log($scope.auth);
        $scope.logout = function(){
            auth.signout();
            store.remove('profile');
            store.remove('token');
            $state.go('auth.dashboard');
            window.location.reload();
        }
    });
