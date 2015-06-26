/**
 * Created by sharadau on 22-06-2015.
 */
'use strict';

angular.module('dashboardApp')
    .controller('EmployeeEditCtrl', function ($scope,$http,EmployeeService) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

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


         $scope.addEmployee = function(){
            EmployeeService.addEmployee($scope.name, $scope.emailId);
            $scope.name = null;
            $scope.emailId = null;
            $scope.fetchList();
            alert("Added Employee");
            window.location.reload();
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

