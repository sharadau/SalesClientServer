/**
 * Created by sujatah on 3/24/2015.
 */
angular.module('dashboardApp')
    .controller('LoginCtrl', ['$scope', '$state','auth','$location','store', function ($scope,$state,auth,$location,store) {
        /*auth.signin({
            popup: true,
            chrome: true,
            standalone: true
        },
        function(){
            $state.go('auth.dashboard');
        },
        function(){
            console.log('There was error')
        });*/
        auth.signin({
                popup: true,
                chrome: true,
                standalone: true
            }, function(profile, token) {

            //check if user id is synerzip id
            if(auth.profile.name.search("synerzip.com") == -1)
            {
                console.log("non synerzip user");
                profile.userType = "outsider";
                profile.privilage = [];
             //   $state.go('auth.loginError');
            }else {
                store.set('profile', profile);
                store.set('token', token);
                //$location.path("/");
                $state.go('auth.home');
            }
            }, function(error) {
                console.log("There was an error logging in", error);
            });
    }]);