'use strict';
 
angular.module('Authentication')
.factory('AuthenticationService',
    [ '$http', '$cookieStore', '$rootScope', '$timeout',
    

    function ( $http,$cookieStore, $rootScope, $timeout) {
        var service = {};
        var res;

    //verify the users credentals 
        service.Login = function (username, password, callback) {
            
         var data = $.param({username:username,password:password});
            
           $http({
                url: 'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/login/',
                method: 'POST',
                data : data,
                headers: {'content-type':'application/x-www-form-urlencoded'}

            }).then(function successCallback(response) {
                response.success = true;
                callback(response);  
            }, function errorCallback(response) {
                alert( "failure message: " + response.status);
                response.success =false;
                callback(response); 
            });
        
    };
    
      service.register = function (username,password,email,callback) {
        var data = $.param({email:email,password:password,username:username});
        $http({
         url:'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/auth/register/',
         method:'POST',
         data:data,
         headers:{'content-type':'application/x-www-form-urlencoded'}

        }).then(function successCallback(response){
            response.success = true;
            callback(response);
        }, function errorCallback(response){
            response.success = false;
            response.message = response.status;
            callback(response);
        });
        };

        service.resetpassword = function(email,callback)
        {
            data = $.param({email:email});
            http({
                url: "http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/auth/password/reset/",
                method:'POST',
                data:data,
                headers: {'content-type':'application/x-www-form-urlencoded'}
            }).then(function successCallback(response){
                response.success = true;
                callback(response);
            },function errorCallback(response){
                response.success = false;
                response.message = "error with api"
                callback(response);
            });
        };

      
    
    //set the users credentials to a global variable
    service.SetCredentials = function (username, password,token) {  
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: password,
                    token: token
                }
            };
  
            $cookieStore.put('globals', $rootScope.globals);
        };
  //clear credentials from globals

        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
  
        return service;
    }]);
  