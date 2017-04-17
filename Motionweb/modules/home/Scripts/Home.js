'use strict';

angular.module('home')

.controller('AddCameraController', ['$http','$scope','$rootScope','$sce','$mdDialog', function($http,$scope,$rootScope,$sce,$mdDialog){
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
        $http.get("/../downloadPython.php?user="+$rootScope.globals.currentUser.username+"&cameraName="+$scope.cameraname).then(function(response){
            console.log("responseeeeee: " + $scope.cameraname);
            alert("Downloading python code success");
            $rootScope.globals.currentUser.newestCamera = $scope.cameraname;


        //    execute in terminal: curl http://ec2-52-27-178-28.us-west-2.compute.amazonaws.com/pythonFiles/script<username><cameraname>.sh | sh
        });
		console.log("success!! Added new camera")
	},function(){

	});}
    $scope.showPromptexe = function(ev) {
        debugger;
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.show({
            controller : 'executionController',
            templateUrl: '../modules/pop-ups/execute_popup.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        }).then(function(answer) {
            $scope.status = 'You said the information was.';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        })
    }
	
}])
	.controller('executionController',['$http','$mdDialog','$window','$cookieStore','$scope','$rootScope','$location','HomeService',function($http,$mdDialog,$window, $cookieStore, $scope,$rootScope,$location,HomeService){
		var username = $rootScope.globals.currentUser.username;
		var newestcamera = $rootScope.globals.currentUser.newestCamera;
		$scope.executeString = "curl http://ec2-52-27-178-28.us-west-2.compute.amazonaws.com/pythonFiles/script"+username+newestcamera+".sh | sh";
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
