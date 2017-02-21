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
	$scope.Cameras= [ 
		{url:'modules/home/Images/Coming_soon.jpg'},
		{url:'modules/home/Images/Coming_soon.jpg'},
		{url:'modules/home/Images/Coming_soon.jpg'},
		{url:'modules/home/Images/Coming_soon.jpg'}
	];    
	$scope.Cameracnt = 4 ;
    
}]);
