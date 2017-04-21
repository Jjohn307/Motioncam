'use strict';
angular.module('settings')
.controller('SettingsController',['$scope','$location','SETTINGSERVICE',function($scope,$location,SETTINGSERVICE){
	var schedule ;
	SETTINGSERVICE.getsettings(function(response)
		{
			if(response.success)
			  {
			    $scope.schedule = response.data;
			    console.log($scope.schedule.monday);
			    $scope.data = {
				cb1: $scope.schedule.is_active,
				timeLength: 10,
				notifications: true,
				timeinterval: false,
				setdays: false,
				from: toTime($scope.schedule.time_from),
				to: toTime($scope.schedule.time_to),
				days : [
    			{ name: 'Monday', wanted : $scope.schedule.monday},
    			{ name: 'Tuesday', wanted: $scope.schedule.tuesday},
    			{ name: 'Wednesday', wanted: $scope.schedule.wednesday},
    			{ name: 'Thursday', wanted: $scope.schedule.thursday},
    			{ name: 'Friday', wanted: $scope.schedule.friday},
    			{ name: 'Saturday',wanted: $scope.schedule.saturday},
    			{ name: 'Sunday', wanted:$scope.schedule.sunday} ]
				};
				console.log($scope.schedule.time_to);
			  }
			  else
			  {
			  	console.log('error from settings');
			  	$scope.data = {
				cb1: false,
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
			 $scope.data.Androidnotifications = response.data.android_notify;
			 console.log("returned true"+response.data);
		}
		else
		{
			$scope.data.notifications = false;
			$scope.data.Androidnotifications =false;
			console.log(response.status);
		}
		 
	});
	

	$scope.updateschedule = function(){
		$scope.schedule.is_active = $scope.data.cb1;
		$scope.schedule.monday = $scope.data.days[0].wanted;
		$scope.schedule.tuesday = $scope.data.days[1].wanted;
		$scope.schedule.wednesday = $scope.data.days[2].wanted;
		$scope.schedule.thursday = $scope.data.days[3].wanted;
		$scope.schedule.friday =$scope.data.days[4].wanted;
		$scope.schedule.saturday = $scope.data.days[5].wanted;
		$scope.schedule.sunday = $scope.data.days[6].wanted;
		$scope.schedule.time_from = sendtime($scope.data.from);
		$scope.schedule.time_to = sendtime($scope.data.to);
		console.log($scope.data.from);
		console.log($scope.schedule);
		console.log('This is notify ' + $scope.data.notifications);
		console.log($scope.schedule.time_from);
		var data = $.param($scope.schedule);
		var notify = {email_notify: $scope.data.notifications,android_notify:$scope.data.Androidnotifications};
		SETTINGSERVICE.updateschedule(data, function(response){
			if(response.success)
			{ 
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

function toTime(timeString){
    var timeTokens = timeString.split(':');
    return new Date(1970,0,1, timeTokens[0], timeTokens[1], timeTokens[2]);
};
function sendtime(date)
{
   var str = String(date);
   var array = str.split(" ");
   return(array[4]);
}
