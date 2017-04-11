'use strict';
angular.module('settings')
.controller('SettingsController',['$scope','$location','SETTINGSERVICE',function($scope,$location,SETTINGSERVICE){
	
	SETTINGSERVICE.getsettings(function(response)
		{
			if(response.success)
			  {
			    $scope.schedule = response.data;
			    console.log($scope.schedule.monday);
			    $scope.data = {
				cb1: true,
				timeLength: 10,
				notifications: true,
				timeinterval: false,
				setdays: false,
				from: new Date($scope.schedule.time_from),
				to: new Date($scope.schedule.time_to),
				days : [
    			{ name: 'Monday', wanted : $scope.schedule.monday},
    			{ name: 'Tuesday', wanted: $scope.schedule.tuesday},
    			{ name: 'Wednesday', wanted: $scope.schedule.wednesday},
    			{ name: 'Thursday', wanted: $scope.schedule.thursday},
    			{ name: 'Friday', wanted: $scope.schedule.friday},
    			{ name: 'Saturday',wanted: $scope.schedule.saturday},
    			{ name: 'Sunday', wanted:$scope.schedule.sunday} ]
				};
			  }
			  else
			  {
			  	console.log('error from settings');
			  	$scope.data = {
				cb1: true,
				timeLength: 10,
				notifications: true,
				timeinterval: false,
				setdays: false,
				from:  new Date(),
				to:  new Date(),
				days : [
    			{ name: 'Monday', wanted :false},
    			{ name: 'Tuesday', wanted: false},
    			{ name: 'Wednesday', wanted: false},
    			{ name: 'Thursday', wanted: false},
    			{ name: 'Friday', wanted: false},
    			{ name: 'Saturday',wanted: false},
    			{ name: 'Sunday', wanted:false} ]
				};
			  }
		});

	SETTINGSERVICE.notify(function(response)
	{
		if(response.success)
		{
			 $scope.data.notifications = response.data.email_notify;
			 console.log("returned true"+response.data.email_notify);
		}
		else
		{
			$scope.data.notifications = false;
			console.log(response.status);
		}
		 
	});
	

	$scope.updateschedule = function(){
		$scope.schedule.monday = $scope.data.days[0].wanted;
		$scope.schedule.tuesday = $scope.data.days[1].wanted;
		$scope.schedule.wednesday = $scope.data.days[2].wanted;
		$scope.schedule.thursday = $scope.data.days[3].wanted;
		$scope.schedule.friday =$scope.data.days[4].wanted;
		$scope.schedule.saturday = $scope.data.days[5].wanted;
		$scope.schedule.sunday = $scope.data.days[6].wanted;
		console.log($scope.schedule);
		var data = $.param($scope.schedule);
		var notify = $.param($scope.data.notifications);
		SETTINGSERVICE.updateschedule(data, function(response){
			if(response.success)
			{ debugger;
				console.log("update complete");
			}
			else
			{
				console.log("fail");
			}
		});
		SETTINGSERVICE.updatenotification(notify,function(response)
		{
			if(response.success)
			{
				console.log("updated notifications");
			}
			else
			{
				console.log("failed to update notifications");
			}
		}
		);
	}
	
	
}]);