
angular.module('home')
.controller('TabController', ['$scope','$rootScope','$location',function($scope,$rootScope,$location){

    $scope.tab = 1;
	$scope.setTab = function(tab)
	{
		$scope.tab = tab;
	}
	$scope.checkTab = function(tab)
	{
		return $scope.tab === tab;
	}
	$scope.data = {
		cb1: true,
		timeLength: 10,
		notifications: true,
		timeinterval: false,
		settime: false,
		from:  new Date(),
		to:  new Date(),
		days : [
    			{ name: 'Monday', wanted: false },
    			{ name: 'Tuesday', wanted: false},
    			{ name: 'Wednesday', wanted: false},
    			{ name: 'Thursday', wanted: false},
    			{ name: 'Friday', wanted: false},
    			{ name: 'Saturday',wanted:false},
    			{ name: 'Sunday', wanted:false} ]
	};
	

}]);
