'use strict';

angular.module('home')

.controller('CameraViewController',['$scope','$rootScope','$location',function($scope,$rootScope,$location){
	$scope.Cameras= [ 
		Camera1:'https://7a786f7d71.dataplicity.io/?action=stream',
		Camera2:'https://7a786f7d71.dataplicity.io/?action=stream',
		Camera3:'https://7a786f7d71.dataplicity.io/?action=stream',
		Camera4:'https://7a786f7d71.dataplicity.io/?action=stream'
	];
	$scope.Cameracnt = 4 ;
    
}]);
