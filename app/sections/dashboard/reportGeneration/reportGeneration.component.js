(function(){
	angular.module('app')
	
	.directive('reportGeneration', reportGenerationDirective)
	
	function reportGenerationDirective() {
		return {
			restrict : "E",
			scope : {
				ds: "=ds",
			    serviceds : "=",
			    headerds : "=",
			    indexFirst: "=indexFirst"
			    
			},
			templateUrl : "report-generation.tpl.html",
			controller : reportGenerationController,
			controllerAs : "vm"
		}
		
	}
	
	reportGenerationController.$inject= ['$rootScope', '$scope','$http','serviceConstants','$state'];
	
	function reportGenerationController($rootScope, $scope, $http, serviceConstants,$state) {
		let baseUrl = serviceConstants.baseUrl;
        var vm = this;
        vm.selectedRow = null;
        vm.disableViewProfile = true;
        vm.disableDelete = true;
        vm.disableActivate = true;
        vm.report = $scope.ds;
        vm.showNothing=false;
        vm.showReport = {};
        vm.showData=true;
        vm.reportType = getReportKey(vm.report.label);
        if ($scope.indexFirst == 0) {
        	vm.showReport[vm.reportType] = true;
        } else {
        	vm.showReport[vm.reportType] = false;
        }
        vm.gridOptions = {
        		 data: [],
                 urlSync: false,
                 columnDefs:[],
                 enableFiltering: true,
                 multiSelect: true
        }
        
        vm.viewProfile = function(){
        	$state.go('report-detail',{
        		'data' : {
        			userId : vm.selectedRow
        		}
        	});
        }
        vm.gridOptions.onRegisterApi = function(gridApi){
            //set gridApi on scope
           // $scope.gridApi = gridApi;
        	
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
            vm.selectedRows = gridApi.selection.getSelectedRows();
            if(vm.selectedRows.length == 1){
            	vm.disableViewProfile = false;
            }
              else{
            	  vm.disableViewProfile = true;
            }
            if(vm.selectedRows.length != 0)
	            vm.disableDelete = false;
	            vm.disableActivate = false;
            });
        }
        
        vm.deleteSelected = function(){
        	console.log(vm.selectedRows);
        }
        vm.activate = function(){
        	console.log(vm.selectedRows);
        }
        	$http.get(`${baseUrl}/reports/view/`+vm.report.reportPath)
            .then(function success(response) {
                if(response.data !== null) {
                   vm.service = response.data.data;
                   vm.gridOptions.data = response.data.data;
                   vm.gridOptions.columnDefs = response.data.headers;
                   if(vm.service.length==0)
                	   {
	                	   vm.showNothing=true;
	                	   vm.showData=false;
                	   }
                   vm.headers= response.data.headers;
                }
                if(response.data == null){
                	
                }
            }, function error(error) {
                console.log(error);
            });
        
        function getReportKey(reportKey) {
        	var key;
        	if (reportKey.toLocaleLowerCase().indexOf("ngo") != -1) {
        		key = "ngo";
        	} else if (reportKey.toLocaleLowerCase().indexOf("volunteer") != -1) {
        		key = "volunteer";
        	} else if (reportKey.toLocaleLowerCase().indexOf("participant") != -1) {
        		key = "participant";
        	} else if (reportKey.toLocaleLowerCase().indexOf("provider") != -1) {
        		key = "provider";
        	}else if (reportKey.toLocaleLowerCase().indexOf("orders") != -1) {
        		key = "orders";
        	}
        	
        	return key;
        }
        
        $rootScope.$on("show-report-view", function(event, type) {
        	vm.showReport[type] = true;
        	vm.disableViewProfile = true;
        	angular.forEach(vm.showReport, function (value, key){
        		if (type !== key) {
        			vm.showReport[key] = false;
        		}
        	});
        	
        	vm.showReport[type] = true;
        });
     
}
	
})();

