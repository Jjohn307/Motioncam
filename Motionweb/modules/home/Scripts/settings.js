angular.module('settings')
.controller('SettingsController',['$scope','$location',function($scope,$location){
	$scope.data = {
		cb1: true,
		timeLength: 10,
		notifications: true,
		timeinterval: false,
		setdays: false,
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