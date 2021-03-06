'use strict';

// declare modules
angular.module('Authentication',[]);
angular.module('home',[]);
angular.module('viewers',[]);
angular.module('settings',[]);
angular.module('Videos',[]);
angular.module('AddCamera',[]);



angular.module('MotionCam', ['ngMaterial',
    'Authentication',
    'home',
    'ngRoute',
    'ngCookies',
    'viewers',
    'settings',
    'Videos',
    'AddCamera',
    'ngSanitize'
    
])
 .controller('ChangeLocationController', ['$location','$rootScope','$scope','$mdSidenav',function($location,$rootScope,$scope, $mdSidenav){
    var originatorEv;

    $scope.changetohome = function(){
            $location.path('/');
        }
    $scope.changetovids = function(){
            $location.path('/Videos');
    }
    $scope.changetoviewers = function(){
        $location.path('/viewers');
    }  
    $scope.changetosettings = function()
    {
        $location.path('/settings');
    }
    $scope.logout = function(){
        $rootScope.globals.currentUser = null;
        $location.path('/login');
    }
    $scope.downloadPythonscript = function()
    {
        var content = 'file content for example';
        var blob = new Blob([ content ], { type : 'text/plain' });
        $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
    }
 }])
    
.config(['$routeProvider','$httpProvider','$compileProvider',function ($routeProvider,$httpProvider,$compileProvider) {
   $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
   
   $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/Authentication/views/MotionLogin.HTML',
            hideMenus: true
        })
 
        .when('/', {
            controller: 'CameraViewController',
            templateUrl: 'modules/home/views/MotionHome.HTML'
        })
        .when('/Videos',{
           controller: 'ViewVideos',
           templateUrl: 'modules/home/views/MotionVids.html' 
        })
        .when('/register',{
            controller: 'registerController',
            templateUrl: 'modules/Authentication/views/register.html'
        })
        .when('/viewers',{
            controller: 'viewersController',
            templateUrl: 'modules/home/views/Add_viewers.html'
        })
        .when('/settings',{
            controller: 'SettingsController',
            templateUrl:'modules/home/views/settings.html'
        })
        .otherwise({ redirectTo: '/login' });

}])

.directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   }
   return fallbackSrc;
})
 .run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            var data = $.param({username:$rootScope.globals.currentUser.username,password:$rootScope.globals.currentUser.authdata});
            console.log(data);
           $http({
                url: 'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/api/auth/token/refresh/',
                method: 'POST',
                data : data,
                headers: {'content-type':'application/x-www-form-urlencoded'}

            }).then(function successCallback(response) {
                $rootScope.globals.currentUser.token = response.data.token;
                console.log("token refreshed",$rootScope.globals.currentUser.token);
            }, function errorCallback(response) {
                console.log( "failure message: " + response.status);
            });

        }
       
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if($location.path().match('^(\/)([activate]+)(\/)(.+)(\/)(.+)$'))
            {
                var str = $location.path();
                console.log("hit");
                var splitedurl = str.split("/");
                var uid = splitedurl[2];
                var token = splitedurl[3];
                console.log(uid + " "+token)

                var data = $.param({uid:uid,token:token});
                var success = true;
                $http({
                    url: 'http://ec2-54-242-89-175.compute-1.amazonaws.com:8000/auth/activate/',
                    method: 'POST',
                    headers: {'content-type':'application/json'},
                    data: data
                }).then(function successCallback(){
                    success = true;
                },function errorCallback(){
                    success = false;
                });
                if(success)
                {
                    alert("congrats your account is activated");
                    $location.path('/login');
                }
                else
                {
                    alert("activation failed");
                    $location.path('/login');
                }
            }
           else if (($location.path() !== '/login' && $location.path() !== '/register') && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
       
        });

        
         
    }])
          
    
        
    /*var header = $('header');
    var thewindow = $(window);
    $(document).scroll(function(){
        if(thewindow.scrollTop() >= 20)
        {
            if(!header.hasClass('fixed'))
            {
                header.addClass('fixed');
            }
            else
            {
                if(header.hasClass('fixed'))
                {
                    header.removeClass('fixed');
                }
            }
        }
    })*/