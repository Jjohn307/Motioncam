'strict'
angular.module('Authentication')

.controller('LoginController',
    ['$window', '$scope', '$rootScope', '$location', 'AuthenticationService','$http',
    function ($window, $scope, $rootScope, $location, AuthenticationService,$http) {
        // reset login status
        $scope.reset = false;
        AuthenticationService.ClearCredentials();
        
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    $window.sessionStorage.username = $scope.username;
                    AuthenticationService.SetCredentials($scope.username, $scope.password,response.data.token);
                    $http.get("/../downloadPython.php?user="+$scope.username).then(function(response){
                      console.log("responseeeeee: " + response.data);
                     alert("Downloading python code success");
                   });
                    $location.path('/');                  
                } 
                else {
                    $scope.error = 'nooo';
                    $scope.dataLoading = false;             
                }
            });
        };
        $scope.changepassword = function()
         {
            if($scope.reset)
              {
                $scope.reset = false;
              }
            else
              {
                $scope.reset = true;
              }
         };
         $scope.submitEmailToChangepassword = function()
         {
            AuthenticationService.resetpassword($scope.email,function(response){
                if(response.success)
                    {
                        $scope.reset = false;
                    }
                else
                    {
                        alert(response.error);
                    }
            });
         };

         $scope.SendToRegistrationPage = function(){
            $location.path('/register');
        };
    }]);