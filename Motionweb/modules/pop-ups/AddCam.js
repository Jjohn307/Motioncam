'use strict';

angular.module('AddCamera')
.controller('AddCameraController', ['$http','$scope', function($http,$scope){
	$scope.Submit = function(){
	var data = $.params({username:$scope.Cameraname,password:$scope.Address});
	$http({
		 url: 'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/camera/',
         method: 'POST',
         data : data,
         headers: {'content-type':'application/x-www-form-urlencoded'}
	}).then(function(response){
		alert('success');
	},function(){

	});}
	
}]);