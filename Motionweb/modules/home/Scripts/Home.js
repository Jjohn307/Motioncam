'use strict';

angular.module('home')

.controller('AddCameraController', ['$http','$scope','$rootScope', function($http,$scope,$rootScope){
	$scope.Submit = function(){

	var data = $.param({name:$scope.cameraname,address:$scope.Address});
    alert($scope.cameraname + " " + $scope.Address);
	$http({
		headers:{
 		'content-type':'application/x-www-form-urlencoded',
 		'Authorization':"jwt " + $rootScope.globals.currentUser.token},
		 url: 'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/camera/',
         method: 'POST',
         data : data
      
	}).then(function(response){
		alert('success');
	},function(){

	});}
	
}])
.controller('CameraViewController',['$http','$mdDialog','$window','$cookieStore','$scope','$rootScope','$location','HomeService',function($http,$mdDialog,$window, $cookieStore, $scope,$rootScope,$location,HomeService){
	$scope.user = $window.sessionStorage.username;
	// console.log("hello world" + $window.sessionStorage.username);
	$scope.Cameras= [ 
		{url:'modules/home/Images/Coming_soon.jpg'},
		{url:'modules/home/Images/Coming_soon.jpg'},
		{url:'modules/home/Images/Coming_soon.jpg'},
		{url:'modules/home/Images/Coming_soon.jpg'}
	];    

	HomeService.obtainUsersVideofeed($rootScope.globals.currentUser.token,function(response){
		if(response.success)
		{
			var obj=response.data;
			alert(obj[0].address);

		}
	 	else
	 	{
	 		alert(response.success);

	 	}
	});
	

	$scope.showPrompt = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.show({
      controller : 'AddCameraController',
      templateUrl: '../modules/pop-ups/AddCam.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
  }).then(function(answer) {
  $scope.status = 'You said the information was.';
}, function() {
  $scope.status = 'You cancelled the dialog.';
}) 
}}]);
