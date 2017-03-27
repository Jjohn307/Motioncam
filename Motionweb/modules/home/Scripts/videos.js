'use strict';

angular.module('Videos')

.controller('ViewVideos', ['$scope','$location','$http','$sce',function($scope,$location,$http,$sce){
     $scope.videos = [];

     $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
     }

     $http({
          url : 'http://d3htql0kckepan.cloudfront.net/',
          method: 'GET'
          }).then(function successcallback(response){
               var obj  =  response;
               var xml =$.parseXML(obj.data);
               var clientid = $(xml).find('Key').each(function(){
                    if($(this).text().match(/\bhello[^\b]*?\b/gi) != null)
                    {
                         var urls = {"url":"http://d3htql0kckepan.cloudfront.net/" + $(this).text()};
                         $scope.videos.push(urls);
                    }
               })
          },function errorcalback(response){
               alert('failed');

          });
	// Hardcode data until api is acessable
    

}]);