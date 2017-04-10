'use strict';

angular.module('home')

<<<<<<< HEAD
.controller('AddCameraController', ['$http','$scope','$rootScope','$sce', function($http,$scope,$rootScope,$sce){
=======
.controller('AddCameraController', ['$http','$scope','$rootScope', function($http,$scope,$rootScope){
>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5
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
<<<<<<< HEAD
		console.log("success!! Added new camera")
=======
		alert('success');
>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5
	},function(){

	});}
	
}])
.controller('CameraViewController',['$http','$mdDialog','$window','$cookieStore','$scope','$rootScope','$location','HomeService',function($http,$mdDialog,$window, $cookieStore, $scope,$rootScope,$location,HomeService){
	$scope.user = $window.sessionStorage.username;
	// console.log("hello world" + $window.sessionStorage.username);
<<<<<<< HEAD
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
=======
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

>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5
		}
	 	else
	 	{
	 		alert(response.success);
<<<<<<< HEAD
	 	}
	});
	console.log($scope.camera);

=======

	 	}
	});
>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5
	

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
