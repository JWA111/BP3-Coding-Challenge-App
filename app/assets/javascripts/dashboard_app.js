
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
	"$scope", "$http",
	function($scope, $http) {
		
		$("#state_options").hide();

		$(function() {
    			$( "#state_datepicker" ).datepicker();
  		});

		$scope.show = function(type) {
			if($scope.current) {
				document.getElementById($scope.current).className = "btn btn-info";
				$("#" + $scope.current + "_options").hide();
			}
			$("#" + type + "_options").show();
			$scope.current = type;
			document.getElementById($scope.current).className = "btn btn-success";
		}
		$scope.report = function(type) {

			if(type == "state") {
				//validate
				var valid = true;
				if(!$scope.stateDate) {
					document.getElementById("state_datepicker").style.borderColor = "red";
					valid = false;
				}
				else {
					document.getElementById("state_datepicker").style.borderColor = "green";
				}
				if(!$scope.stateHour) {
                                        document.getElementById("state_time_hour").style.borderColor = "red";
                                        valid = false;
                                }
				else {
					document.getElementById("state_time_hour").style.borderColor = "green";	
				}
				if(!$scope.stateMin) {
                                        document.getElementById("state_time_min").style.borderColor = "red";
                                        valid = false;
                                }
				else {
					document.getElementById("state_time_min").style.borderColor = "green";	
				}
				if(!$scope.stateSec) {
                                        document.getElementById("state_time_sec").style.borderColor = "red";
                                        valid = false;
                                }
				else {
					document.getElementById("state_time_sec").style.borderColor = "green";
				}
				if(!$scope.stateTime) {
                                        document.getElementById("state_select_time").style.borderColor = "red";
                                        valid = false;
                                }
				else {
					document.getElementById("state_select_time").style.borderColor = "green";
				}

				//when validated
				if(valid) {
					var params = {};
					params.type = "state";
					params.date = $scope.stateDate;
					params.hour = $scope.stateHour;
					params.min = $scope.stateMin;
					params.sec = $scope.stateSec;
					params.time = $scope.stateTime;
					console.log(params);
				}
			}	
		}
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
