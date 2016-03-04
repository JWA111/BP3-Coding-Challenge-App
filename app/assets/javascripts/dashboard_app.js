
var app = angular.module(
	'dashboard', 
	[
		'ngRoute',
		'ngResource',
		'templates'
	]
)

.config([
	"$routeProvider",
	function($routeProvider) {
		$routeProvider.when("/", {
			controller: "HomeController",
			templateUrl: "home.html"
		});
		$routeProvider.when("/tasks", {
			controller: "TaskController",
			templateUrl: "tasks.html"
		});
		$routeProvider.when("/import", {
			controller: "ImportController",
			templateUrl: "import.html"
		});
		$routeProvider.when("/about", {
			controller: "AboutController",
			templateUrl: "about.html"
		});
	}
])

.controller( "DashboardController", [
	"$scope","$location",
	function($scope, $location) {
		$scope.active = "home";
		addEventListener('load', activate, false);
		$scope.show = function(locale) {
			if(locale == "home") {
				$location.path("/");
				deactivate();
				$scope.active = "home";
				activate();
			}
			else {
				$location.path("/" + locale);
				deactivate();
				$scope.active = locale;
				activate();
			}
		};

		function activate(){
        		document.getElementById($scope.active).className = "active";
		}
		function deactivate(){
        		document.getElementById($scope.active).className = "";
		}
	}
])
.controller( "HomeController", [
	"$scope",
	function($scope) {
		
	}
])
.controller( "TaskController", [
	"$scope",
	function($scope) {
		
	}
])
.controller( "ImportController", [
	"$scope","$http",
	function($scope, $http) {
		$scope.upload = function() {
			try {
				$scope.data = JSON.parse(document.getElementById("import_data").value);
				console.log($scope.data);
			}
			catch(err) {
				alert("please check the formatting of your data");
			}
		}
	}
])
.controller( "AboutController", [
	"$scope",
	function($scope) {
		
	}
])



.factory("task", [
	"$resource",
	function($resource) {
		var task = 
		$resource("/instances/:task_id.json", 
			{"task_id": "@taskId"}, 
			{
				"create": {method: "POST"},
				"index": {method: "GET", isArray: true},
				"update": {method: "PUT"},
				"destroy": {method: "DELETE"}
			}
		);
		return task;
	}
]);
