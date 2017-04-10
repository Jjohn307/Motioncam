'use strict';

angular.module('Videos')

<<<<<<< HEAD
.controller('ViewVideos', ['$rootScope','$scope','$location','$http','$sce',function($rootScope,$scope,$location,$http,$sce){
   
     $scope.videos = [];
     
=======
.controller('ViewVideos', ['$scope','$location','$http','$sce',function($scope,$location,$http,$sce){
     $scope.videos = [];
>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5

     $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
     }

<<<<<<< HEAD
     // lets video.js know that this is a valid source
     $scope.trustSrc = function(src) {
          return $sce.trustAsResourceUrl(src);
     }

     /*$http({
=======
     $http({
>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5
          url : 'http://d3htql0kckepan.cloudfront.net/',
          method: 'GET'
          }).then(function successcallback(response){
               var obj  =  response;
               var xml =$.parseXML(obj.data);
               var clientid = $(xml).find('Key').each(function(){
                    if($(this).text().match(/\bhello[^\b]*?\b/gi) != null)
                    {
<<<<<<< HEAD
                         var keyandurls = {"key":String($(this).text()),"url":"http://d3htql0kckepan.cloudfront.net/" + $(this).text()};
                         $scope.videos.push(keyandurls);
=======
                         var urls = {"url":"http://d3htql0kckepan.cloudfront.net/" + $(this).text()};
                         $scope.videos.push(urls);
>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5
                    }
               })
          },function errorcalback(response){
               alert('failed');
<<<<<<< HEAD

          });
        */
    
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
                 var pathanddelete = {"id":xml[i].id,"Path":String(xml[i].path),"deleteurl":String(xml[i].delete),'thumbnail':String(xml[i].thumbnail)};
                 $scope.videos.push(pathanddelete);
               }
              
               }
          ,function errorcalback(response){
               alert('failed');

          });
        
        $scope.deletevid = function(vid){ 
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
          };


    /* $scope.deletevid = function(vid){ 
      AWS.config.region = 'us-east-1';
      AWS.config.update({
        accessKeyId: "AKIAI2HHX4MHC7TXQOTA",
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

     }*/
=======

          });
>>>>>>> ec543b9df7719880de8c976910eac3be22a4abc5
	// Hardcode data until api is acessable
    

}]);