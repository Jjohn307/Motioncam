'use strict';

angular.module('Videos')
.controller('ViewVideos', ['$rootScope','$scope','$location','$http','$sce','$filter',function($rootScope,$scope,$location,$http,$sce,$filter){
     $scope.currentPage = 0;
     $scope.pageSize = 6;
     $scope.videos = [];
     $scope.q = '';



     // lets video.js know that this is a valid source
     $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
     }
	
	
	 $scope.getData = function () {
      // needed for the pagination calc
      // https://docs.angularjs.org/api/ng/filter/filter
      return $filter('filter')($scope.videos, $scope.q)
     /* 
       // manual filter
       // if u used this, remove the filter from html, remove above line and replace data with getData()
       
        var arr = [];
        if($scope.q == '') {
            arr = $scope.data;
        } else {
            for(var ea in $scope.data) {
                if($scope.data[ea].indexOf($scope.q) > -1) {
                    arr.push( $scope.data[ea] );
                }
            }
        }
        return arr;
       */
    }
    
    $scope.numberOfPages=function(){
        return Math.ceil($scope.getData().length/$scope.pageSize);                
    }

     $http({
          url : 'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/video/list/hello/',
          method: 'GET',
          headers:{
          'content-type':'application/json',
          'Authorization':"jwt " + $rootScope.globals.currentUser.token
          }
          }).then(function successcallback(response){
               var obj  =  response;
               var xml =obj.data;
               console.log(xml.length);
               var i ;

               for(i =0;i<xml.length;i++)
               {
                 var pathanddelete = {"id":xml[i].id,"Path":String(xml[i].path),"deleteurl":String(xml[i].delete),'thumbnail':String(xml[i].thumbnail), 'video_name':String(xml[i].video_name),'cam':String(xml[i].cam),'created_time':String(xml[i].created_time)};
                 $scope.videos.push(pathanddelete);
               }
              
               }
          ,function errorcalback(response){
               alert('failed');

          });
        
        /*$scope.deletevid = function(vid){ 
          $http({
            url: vid.deleteurl,
            headers: {
                  'Content-Type':'application/json',
                  'Authorization':"jwt "+$rootScope.globals.currentUser.token},
            method: 'DELETE'

          }).then(function successcallback(response){

             console.log('success');
          },
          function errorcallback(response)
          {
             console.log('failed');
          }
          )
          };*/


     $scope.deletevid = function(vid){ 
      AWS.config.region = 'us-east-1';
      AWS.config.update({
        accessKeyId: "AKIAJAY32ULQFOURJW5Q",
        secretAccessKey: "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" 
      });


      var s3 = new AWS.S3({params: {Bucket: 'sketchflow'}});
      s3.deleteObject({Key:'Hello/Hello_test3.mp4'}, function (err, res) {
        if (err) {
          console.log("Error uploading data: ", err);
        } else {
          console.log("Successfully deleted",vid.key,res.status);
        }
      });

     }
	// Hardcode data until api is acessable
    

}])

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});