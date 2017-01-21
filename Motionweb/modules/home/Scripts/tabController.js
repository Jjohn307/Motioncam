
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
    			{ name: 'tuesday', wanted: false},
    			{ name: 'wednesday', wanted: false},
    			{ name: 'thursday', wanted: false},
    			{ name: 'friday', wanted: false},
    			{ name: 'saturday',wanted:false},
    			{ name: 'sunday', wanted:false} ]
	};
	

}]);
