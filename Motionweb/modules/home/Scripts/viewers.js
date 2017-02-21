
angular.module('viewers', [])
.controller('viewersController', ['$scope','$location', function($scope,$location){
	$scope.viewers = [
	{firstName:'Test1',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test2',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test3',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test4',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test5',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test6',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test7',lastName:'Testing',email:'Testing@live.com'}
	];

	//Replace with api call once created
	$scope.delete = function(num){
		$scope.viewers.splice(num,1);
	};
}]);