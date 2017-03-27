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
    'AddCamera'
    
])
 .controller('ChangeLocationController', ['$location','$rootScope','$scope',function($location,$rootScope,$scope){
    var originatorEv;

     $scope.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    }

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

.directive('stickyMenu',function($mdSticky,$compile){
    return{
        restrict:'E',
        link: function(scope,element){
            $mdSticky(scope,element);
        }
    };
})
 
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if (($location.path() !== '/login' && $location.path() !== '/register') && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
       
        });
        
         
    }]);
    
        
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