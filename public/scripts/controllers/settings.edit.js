/**
 * Created by sharadau on 22-06-2015.
 */
'use strict';

angular.module('dashboardApp')
    .controller('SettingsEditCtrl', function ($scope,$http,UsersService) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.empEmail = new Array();
        $scope.inc = 0;
        $scope.fetchList = function(){
            //console.log("in fetchlist");
            UsersService.getUsers()
                .success (function (data){
                $scope.Users = data;
               // console.log("Users: "+$scope.Users)
            })
                .error (function (error){
                console.log (error);
            });
        }
        $scope.fetchList();
        /*$scope.displayArea = function() {
            $scope.areaDiv.style.display = "block";
        }*/
        $scope.getEmail = function(val) {
            console.log("emps:"+$scope.empEmail);
            console.log("emps:"+$scope.empEmail.length);
            for(var i=0;i<$scope.empEmail.length;i++)
            {
                console.log("emp array:"+$scope.empEmail[i][0] + " sync:"+$scope.asyncSelected);
                if($scope.asyncSelected == $scope.empEmail[i][0])
                {
                    $scope.emailId = $scope.empEmail[i][1];
                    $scope.emailId = $scope.empEmail[i][1];
                }
            }
        };
        $scope.getEmployees = function(val) {
            return $http.get(service_base_url+'/api/employees/name/'+val, {
            }).then(function(response){
                console.log(response.data);
                return response.data.map(function(item){
                    $scope.empEmail[$scope.inc] = new Array();
                    $scope.empEmail[$scope.inc][0] = item.name;
                    $scope.empEmail[$scope.inc][1] = item.emailId;
                    $scope.inc ++;
                    return item.name;
                });
            });
        };

        $scope.addUser = function(){
            console.log("addSalesPerson in cntrlr: "+$scope.area);
            UsersService.addUser($scope.asyncSelected, $scope.area, $scope.emailId,$scope.userType);
            $scope.asyncSelected = null;
            $scope.emailId = null;
            //$scope.area = null;
            $scope.fetchList();
            alert("Added User");
            window.location.reload();
        };

        $scope.deleteSalesPerson = function(id, name) {

            if (confirm("Do you want to delete User "+name) == true) {
                // todo code for deletion
                UsersService.deleteUser(id);
                $scope.fetchList();
               // $state.reload();
                window.location.reload();
            }
        }

    });

