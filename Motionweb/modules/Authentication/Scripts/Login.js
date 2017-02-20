'strict'
angular.module('Authentication')

.controller('LoginController',
    ['$window', '$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($window, $scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
        
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(response.success) {
                    $window.sessionStorage.username = $scope.username;
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/');                  
                } 
                else {
                    $scope.error = 'nooo';
                    $scope.dataLoading = false;             
                }
            });
        };
         $scope.SendToRegistrationPage = function(){
            $location.path('/register');
        };
    }]);