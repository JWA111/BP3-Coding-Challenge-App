
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
)
.controller( "TaskOverviewController", [
	"$scope", "$http",
	function($scope, $http) {
		
		$("#state_options").hide();
        $("#time_options").hide();
        $("#instance_options").hide();
        $("#assignee_options").hide();
        $("#results").hide();

		$(function() {
            $( "#state_datepicker" ).datepicker();
            $( "#time_datepicker1" ).datepicker();
            $( "#time_datepicker2" ).datepicker();
  		});

		$scope.show = function(type) {
			if($scope.current) {
				document.getElementById($scope.current).className = "btn btn-info";
				$("#" + $scope.current + "_options").hide();
			}
			$("#" + type + "_options").show();
			$scope.current = type;
			document.getElementById($scope.current).className = "btn btn-success";
		};
		$scope.report = function(type) {
            //for system state report
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
					$http.get("/tasks.json",
                        {"params": params})
                        .then(function(response) {
                            $scope.open = response.data.open;
                            $scope.closed = response.data.closed;
                            $scope.title = "System State";
                            $scope.criteria = $scope.stateDate + ' ' + $scope.stateHour + ":" + $scope.stateMin + ":" + $scope.stateSec + " " + $scope.stateTime;
                            $("#results").show();
                        }, function(response) {
                            console.log("Error: Server status " + response.status);
                        });
				}
			}
            //for system state report
            else if(type == "time") {
                //validate
                var valid = true;
                if(!$scope.timeDate) {
                    document.getElementById("time_datepicker1").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_datepicker1").style.borderColor = "green";
                }
                if(!$scope.timeHour) {
                    document.getElementById("time_time_hour1").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_time_hour1").style.borderColor = "green";
                }
                if(!$scope.timeMin) {
                    document.getElementById("time_time_min1").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_time_min1").style.borderColor = "green";
                }
                if(!$scope.timeSec) {
                    document.getElementById("time_time_sec1").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_time_sec1").style.borderColor = "green";
                }
                if(!$scope.timeTime) {
                    document.getElementById("time_select_time1").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_select_time1").style.borderColor = "green";
                }
                if(!$scope.timeDate2) {
                    document.getElementById("time_datepicker2").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_datepicker2").style.borderColor = "green";
                }
                if(!$scope.timeHour2) {
                    document.getElementById("time_time_hour2").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_time_hour2").style.borderColor = "green";
                }
                if(!$scope.timeMin2) {
                    document.getElementById("time_time_min2").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_time_min2").style.borderColor = "green";
                }
                if(!$scope.timeSec2) {
                    document.getElementById("time_time_sec2").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_time_sec2").style.borderColor = "green";
                }
                if(!$scope.timeTime2) {
                    document.getElementById("time_select_time2").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("time_select_time2").style.borderColor = "green";
                }

                //when validated
                if(valid) {
                    var params = {};
                    params.type = "time";
                    params.date = $scope.timeDate;
                    params.hour = $scope.timeHour;
                    params.min = $scope.timeMin;
                    params.sec = $scope.timeSec;
                    params.time = $scope.timeTime;
                    params.date2 = $scope.timeDate2;
                    params.hour2 = $scope.timeHour2;
                    params.min2 = $scope.timeMin2;
                    params.sec2 = $scope.timeSec2;
                    params.time2 = $scope.timeTime2;
                    $http.get("/tasks.json",
                        {"params": params})
                        .then(function(response) {
                            $scope.open = response.data.open;
                            $scope.closed = response.data.closed;
                            $scope.title = "Time Span";
                            $scope.criteria = $scope.timeDate + ' ' + $scope.timeHour + ":" + $scope.timeMin + ":" + $scope.timeSec + " " + $scope.timeTime
                                                + " to " + $scope.timeDate2 + ' ' + $scope.timeHour2 + ":" + $scope.timeMin2 + ":" + $scope.timeSec2 + " " + $scope.timeTime2;
                            $("#results").show();
                        }, function(response) {
                            console.log("Error: Server status " + response.status);
                        });
                }
            }
            else if(type == "instance") {
                //validate
                var valid = true;
                if(!$scope.instanceId) {
                    document.getElementById("instance_id").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("instance_id").style.borderColor = "green";
                }
                if(valid) {
                    var params = {};
                    params.type = "instance";
                    params.id = $scope.instanceId;
                    $http.get("/tasks.json",
                        {"params": params})
                        .then(function(response) {
                            $scope.open = response.data.open;
                            $scope.closed = response.data.closed;
                            $scope.title = "Instance";
                            $scope.criteria = "ID " + $scope.instanceId;
                            $("#results").show();
                        }, function(response) {
                            console.log("Error: Server status " + response.status);
                        });
                }
            }
            else if(type == "assignee") {
                //validate
                var valid = true;
                if(!$scope.assignee) {
                    document.getElementById("assignee_name").style.borderColor = "red";
                    valid = false;
                }
                else {
                    document.getElementById("assignee_name").style.borderColor = "green";
                }
                if(valid) {
                    var params = {};
                    params.type = "assignee";
                    params.name = $scope.assignee;
                    $http.get("/tasks.json",
                        {"params": params})
                        .then(function(response) {
                            $scope.open = response.data.open;
                            $scope.closed = response.data.closed;
                            $scope.title = "Assignee";
                            $scope.criteria = "Name - " + $scope.assignee;
                            $("#results").show();
                        }, function(response) {
                            console.log("Error: Server status " + response.status);
                        });
                }
            }
        };
	}
])
.controller( "TaskSearchController", [
	"$scope",
	function($scope) {

        $("#filter-options").hide();

        $(function() {
            $( "#datepicker1" ).datepicker();
            $( "#datepicker2" ).datepicker();
        });

        $scope.toggle = function() {
            if($("#filter-options").is(":visible")){
                $("#filter-options").slideUp("slow", "swing");
            }
            else {
                $("#filter-options").slideDown("slow", "swing");
            }
        }
	}
])
.controller( "ImportController", [
	"$scope","$http",
	function($scope, $http) {

		$scope.upload = function() {
            $scope.success = "yes";
            $scope.scount = 0;
            $scope.fcount = 0;
            try {
                $scope.suc = 0;
                $scope.fail = 0;
                $scope.msg = null;
                var data = JSON.parse(document.getElementById("import_data").value);
                for(var i=0; i < data.length; i++) {
                    $http.post("/tasks.json",
                                params = {
                                    instanceName: data[i].instanceName,
                                    dueDate: data[i].dueDate,
                                    priority: data[i].priority,
                                    closeDate: data[i].closeDate,
                                    instanceStatus: data[i].instanceStatus,
                                    assigneeType: data[i].assigneeType,
                                    createDate: data[i].createDate,
                                    name: data[i].name,
                                    url: data[i].url,
                                    assignee: data[i].assignee,
                                    instanceId: data[i].instanceId,
                                    status: data[i].status,
                                    variables: JSON.stringify(data[i].variables),
                                    processName: data[i].processName,
                                    taskId: data[i].id
                                })
                        .then(function(response) {

                        }, function(response) {
                            $scope.fcount++;
                            $scope.scount--;
                            $scope.success = "no";
                        });
                    $scope.scount++;
                }
                if($scope.fcount > 0) {
                    $scope.msg = "Status: Failed to upload "+  $scope.fcount + " tasks.";
                }
                else {
                    $scope.msg = "Status: successfully uploaded "+  $scope.scount + " tasks.";
                }
                document.getElementById("import_data").value = "";
            }
            catch(err) {
                $scope.msg = "please check the formatting of your data\n" + err;
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
