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
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/Authentication/views/MotionLogin.html',
            hideMenus: true
        })
 
        .when('/', {

            controller: 'TabController',
            templateUrl: 'modules/home/views/MotionHome.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);

