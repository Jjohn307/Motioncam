'use strict'
angular.module('Authentication')

.controller('registerController', 
	['$scope','$location','AuthenticationService',function($scope,$location,AuthenticationService){

	 $scope.register = function(){
	 	    AuthenticationService.register($scope.username,$scope.password,$scope.email,function(response){
	 		$scope.dataloading = true;
	 		if(response.success)
	 		{
	 			alert("successfully registered");
	 			$location.path("/login");
	 		}
	 		else
	 		{
	 			console.log(response.status);
 	 			$scope.dataLoading = false;             

	 		}

	 	});
     


	 };

	}
]);
