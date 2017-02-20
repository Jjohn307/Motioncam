'use strict';

angular.module('home')

.controller('CameraViewController',['$scope','$rootScope','$location',function($scope,$rootScope,$location){
	$scope.Cameras= [ 
		{url:'modules/home/images/Coming_soon.jpg'},
		{url:'modules/home/images/Coming_soon.jpg'},
		{url:'modules/home/images/Coming_soon.jpg'},
		{url:'modules/home/images/Coming_soon.jpg'}
	];    
}]);
