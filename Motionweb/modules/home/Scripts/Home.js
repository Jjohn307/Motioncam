'use strict';

angular.module('home')

.controller('CameraViewController',['$http', '$window', '$cookieStore', '$scope','$rootScope','$location',function($http, $window, $cookieStore, $scope,$rootScope,$location){
	$scope.user = $window.sessionStorage.username;
	// console.log("hello world" + $window.sessionStorage.username);

	$http.get("downloadPython.php?user="+$scope.user)
    .then(function(response) {
    	// console.log(response);
        $scope.myWelcome = response.data;
    });
	// $scope.Cameras= [ 
	// 	Camera1:'https://7a786f7d71.dataplicity.io/?action=stream',
	// 	Camera2:'https://7a786f7d71.dataplicity.io/?action=stream',
	// 	Camera3:'https://7a786f7d71.dataplicity.io/?action=stream',
	// 	Camera4:'https://7a786f7d71.dataplicity.io/?action=stream'
	// ];
	$scope.Cameracnt = 4 ;
    
}]);
