
angular.module('viewers', [])
.controller('viewersController', ['$scope','$location', function($scope,$location){
	$scope.viewers = [
	{firstName:'Test',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test',lastName:'Testing',email:'Testing@live.com'},
	{firstName:'Test',lastName:'Testing',email:'Testing@live.com'}
	];

	//Replace with api call once created
	$scope.delete = function(num){
		$scope.viewers.splice(num,1);
	};
}]);