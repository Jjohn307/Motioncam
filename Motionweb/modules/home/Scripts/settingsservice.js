'use strict';
angular.module('settings')
.factory('SETTINGSERVICE',['$rootScope','$http', function($rootScope,$http){
 var service = {};
 service.updateschedule= function(data,callback)
 {

   $http({
   	 headers:{'content-type':'application/x-www-form-urlencoded',
 	'Authorization':"jwt " + $rootScope.globals.currentUser.token},
   	 method:'PUT',
   	 url:'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/schedule/detail/' + $rootScope.globals.currentUser.username + '/',
   	 data:data
   }).then(function successcallback(response)
   {
   	 response.success = true;
   	 callback(response);
   },
   function errorcallback(response)
   {
   	 response.success = false;
   	 callback(response);
   });

 };
 service.getsettings = function(callback)
 {
 	$http({
 		url:'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/schedule/detail/' + $rootScope.globals.currentUser.username + '/',
 		method:'GET',
 		headers: { 'Authorization' : "jwt " + $rootScope.globals.currentUser.token,
 					'content-type' : 'application/json'}

 		}
 	).then(function successcallback(response)
 	{
 		response.success =true;
 		callback(response);
 	},
 	function errorcallback(response)
 	{
       response.success =false;
       callback(response);
 	});
 };
service.notify = function(callback)
{
	$http({
		url:'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/notification/update/' + $rootScope.globals.currentUser.username +'/',
		method: 'GET',
		headers: { 'Authorization' : "jwt " + $rootScope.globals.currentUser.token,
 					'content-type' : 'application/json'}
	}).then(function successcallback (response)
	{
		response.success =true;
		callback(response);
	},
	function errorcallback(response)
	{
		response.success =false;
		callback(response);
	});
};
service.updatenotification =  function(data,callback)
{
	$http({
		url:'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/notification/update/'+ $rootScope.globals.currentUser.username +'/',
		method: 'PUT',
		headers: { 'Authorization' : "jwt " + $rootScope.globals.currentUser.token},
		data:data
	}).then(function successcallback(response)
	 {
	 	response.success = true;
	 	callback(response);
	 },
	 function errorcallback(response)
	 {
	 	response.success = false;
	 	callback(response);
	 }
	);
};
 return service;
}
]
);
