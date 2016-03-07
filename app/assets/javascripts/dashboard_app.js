
var app = angular.module(
	'dashboard', 
	[
		'ngRoute',
		'ngResource',
		'templates',
		'ng-rails-csrf'
	]
)

.config([
	"$routeProvider",
	function($routeProvider) {
		$routeProvider.when("/", {
			controller: "HomeController",
			templateUrl: "home.html"
		});
		$routeProvider.when("/task_overview", {
			controller: "TaskOverviewController",
			templateUrl: "task_overview.html"
		});
		$routeProvider.when("/task_search", {
			controller: "TaskSearchController",
			templateUrl: "task_search.html"
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
]
).controller( "TaskOverviewController", [
	"$scope",
	function($scope) {
		
	}
])
.controller( "TaskSearchController", [
	"$scope",
	function($scope) {
		
	}
])
.controller( "ImportController", [
	"$scope","$http","Task",
	function($scope, $http, Task) {

		$scope.upload = function() {
			try {
				$scope.suc = 0;
				$scope.fail = 0;
				$scope.msg = null;
				var data = JSON.parse(document.getElementById("import_data").value);
				for(var i=0; i < data.length; i++) {
					var newTask = new Task(data[i]);
					newTask.variables = JSON.stringify(newTask.variables);
					newTask.taskId = newTask.id;
					delete newTask.id;	
					newTask.$save();
				}
				document.getElementById("import_data").value = "Uploaded!!!";	
			}
			catch(err) {
				alert("please check the formatting of your data\n" + err);
			}
		}
	}
])
.controller( "AboutController", [
	"$scope",
	function($scope) {
		
	}
])



.factory("Task", [
	"$resource",
	function($resource) {
		var Task = $resource("/tasks/:id.json");
		return Task;
	}
]);
