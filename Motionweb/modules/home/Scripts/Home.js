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
					var cam = {'url':String(obj[i].address),'id':String(obj[i].cid),'name':String(obj[i].name),'index': i};
					console.log(obj[i]);
					$scope.Cameras.push(cam);
				}
		}
	 	else
	 	{
	 		alert(response.success);
	 	}
	});
	console.log($scope.camera);

    $scope.delete = function(id,index){
    	HomeService.Deletestream(id,function(response){
    			if(response.success)
    			{
             alert('video deleted');
             $scope.Cameras.splice(index,1);
    				 console.log("Deletion successfull");
    				 HomeService.obtainUsersVideofeed($rootScope.globals.currentUser.token,function(response){
             if(response.success)
              {
                var obj=response.data;
                var array=[];
                   for(var i =0;i<obj.length;i++)
                    {
                       var cam = {'url':String(obj[i].address),'id':String(obj[i].cid)};
                       console.log(obj[i]);
                       $scope.Cameras.push(cam);
                    }
              }

            else
              {
                 alert(response.success);
              }
           });		
    			}
    			else
    			{
            console.log("Failure");
    			}
    	});
    }
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
}}])
.directive('imageWithDownload', function($animate) {
    return {
        scope: {
            thisSrc: "@src",
            btn1action: "&btn1Action",
            btn1label: "@btn1Label",
            btn2label:"@btn2Label"
        },
        template: '<div class="row img-btn-container">' +
            '<img class="image-fit md-whiteframe-11dp" fallback-src="modules/home/images/there-is-no-connected-camera-mac.jpg" ng-src="{{thisSrc}}"/>' +
            '<div class="btn-group fade btn-img-overlay style="opacity: 0; width: 75%;">' +
            '<span class="center">{{btn1label}}</span>' +
            '<md-button ng-click="btn1action()" class="md-icon-button" style="margin-left: 50%;">' +
            '<i class="material-icons">delete</i>' +
            '</md-button>' +
            '</div>' +
            '</div>',
        link: function(scope, el, attrs) {
            el.on('mouseenter', function() {
                TweenMax.to($(".btn-img-overlay"), 0, {opacity: 1});
            })
            el.on('mouseleave', function() {
                TweenMax.to($(".btn-img-overlay"), 1, {opacity: 0});
            })
        }

    }
});
