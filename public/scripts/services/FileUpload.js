/**
 * Created by sharadau on 14-04-2015.
 */
angular.module('dashboardApp')
    .service('FileUpload', function ($http) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.uploadFileToUrl = function(file, uploadUrl){
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(){
                    console.log("Success");
                })
                .error(function(err){
                    console.log(err);
                });
        }
    });
