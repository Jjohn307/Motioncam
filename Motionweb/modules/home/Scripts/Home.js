'use strict';

angular.module('home')

.controller('AddCameraController', ['$http','$scope','$rootScope','$sce', function($http,$scope,$rootScope,$sce){
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
		console.log("success!! Added new camera")
	},function(){

	});}
	
}])
.controller('CameraViewController',['$http','$mdDialog','$window','$cookieStore','$scope','$rootScope','$location','HomeService',function($http,$mdDialog,$window, $cookieStore, $scope,$rootScope,$location,HomeService){
	$scope.user = $window.sessionStorage.username;
	// console.log("hello world" + $window.sessionStorage.username);
	 $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
     }
	$scope.Cameras = []
	 HomeService.obtainUsersVideofeed($rootScope.globals.currentUser.token,function(response){
		if(response.success)
		{
			var obj=response.data;
			var array=[];
			for(var i =0;i<obj.length;i++)
				{
					var camUrl = {'url':String(obj[i].address)}
					console.log(camUrl.url);
					$scope.Cameras.push(camUrl);
				}
		}
	 	else
	 	{
	 		alert(response.success);
	 	}
	});
	console.log($scope.camera);

	

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
