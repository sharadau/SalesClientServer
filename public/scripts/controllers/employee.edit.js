/**
 * Created by sharadau on 22-06-2015.
 */
'use strict';

angular.module('dashboardApp')
    .controller('EmployeeEditCtrl', function ($scope,$http,EmployeeService, UsersService) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.notValidEmail = false;
        $scope.fetchList = function(){

            EmployeeService.getEmployees()
                .success (function (data){
                $scope.employees = data;
                console.log("emps:"+JSON.stringify(data));
            })
                .error (function (error){
                console.log (error);
            });
        }
        $scope.fetchList();


        document.getElementById("invalidEmail").style.display = "none";
         $scope.checkEmailExists = function() {
             $scope.notValidEmail = false;
             document.getElementById("invalidEmail").style.display = "none";
            EmployeeService.checkUserEmailId($scope.emailId)
                 .success (function (data){
                $scope.employeeExists = data;
                if(typeof  $scope.employeeExists == 'object')
                {
                    $scope.addEmployeeForm.$valid = false;
                    document.getElementById("invalidEmail").style.display = "block";
                    $scope.notValidEmail = true;
                }
            })
                .error (function (error){
                console.log (error);
            });
         }
         $scope.addEmployee = function(){
             document.getElementById("invalidEmail").style.display = "none";
             if( $scope.notValidEmail == false) {
                 $scope.addEmployeeForm.$valid = false;
                 EmployeeService.addEmployee($scope.name, $scope.emailId);
                 $scope.name = null;
                 $scope.emailId = null;
                 $scope.fetchList();
                 alert("Added Employee");
                 window.location.reload();
             }else{
                 //alert("Employee with email Id "+$scope.emailId+" exists");
                 document.getElementById("invalidEmail").style.display = "block";
                 return;
             }
        };

        $scope.deleteEmployee = function(id, name) {

            if (confirm("Do you want to delete Employee "+name) == true) {
                // todo code for deletion
                EmployeeService.deleteEmployee(id);
                $scope.fetchList();
                window.location.reload();
            }
        }

    });

