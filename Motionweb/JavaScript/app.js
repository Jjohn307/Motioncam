'use strict';

// declare modules



angular.module('Authentication',[]);
angular.module('home',[]);


angular.module('BasicHttpAuthExample', ['ngMaterial',
    'Authentication',
    'home',
    'ngRoute',
    'ngCookies'
    
])
 .controller('ChangeLocationController', ['$location', function($location){
    this.changetohome = function(){
            $location.path('/');
        };
    this.changetovids = function(){
            $location.path('/Videos');
    };

     
 }])
.config(['$routeProvider', function ($routeProvider) {

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
           controller: 'Videos',
           templateUrl: 'modules/home/views/MotionVids.html' 
        })
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
       
        });
        
         
    }]);
        
