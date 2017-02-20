'use strict';

angular.module('Videos')

.controller('ViewVideos', ['$scope','$location',function($scope,$location){


	// Hardcode data until api is acessable
     $scope.videos = [
     {video:'modules/home/images/Coming_soon.jpg'},
     {video:'modules/home/images/Coming_soon.jpg'},
     {video:'modules/home/images/Coming_soon.jpg'},
     {video:'modules/home/images/Coming_soon.jpg'},
     {video:'modules/home/images/Coming_soon.jpg'},
     {video:'modules/home/images/Coming_soon.jpg'},
	 {video:'modules/home/images/Coming_soon.jpg'},
     {video:'modules/home/images/Coming_soon.jpg'}
     ];


}]);