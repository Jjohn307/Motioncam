'use strict';
angular.module('home')
.factory('HomeService',['$rootScope','$http', function($rootScope,$http){
 var service = {};
 service.obtainUsersVideofeed = function(token,callback){
 	 var data = $.param({Authorization:"jwt'"+$rootScope.globals.currentUser.token+"'"});

 	$http({
 		headers:{
 		'Content-Type':'application/json',
 		'Authorization':"jwt "+$rootScope.globals.currentUser.token},
		 method:"GET",
 		 url:"http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/camera/"
 	}).then(function successCallback(response){
 		response.success = true;
 		callback(response);
 	},function errorCallback(response)
 	{
 		response.success = false;
 		callback(response);
 	});
 };
 return service;
}]);
