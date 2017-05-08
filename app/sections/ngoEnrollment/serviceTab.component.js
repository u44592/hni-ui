(function() {
    angular.module('app')
        .directive('serviceTab', serviceDirective)

    function serviceDirective() {
        return {
            scope: {

            },
            restrict: "E",
            templateUrl: "serviceTab.tpl.html",
            controller: serviceController,
            controllerAs: 'vm'
        }

    }

    serviceController.$inject = ['$q', 'ngoEnrollmentService', '$rootScope', '$scope', '$mdToast', 'validateFormData'];

    function serviceController($q, ngoEnrollmentService, $rootScope, $scope, $mdToast, validateFormData) {

        var vm = this;
        vm.fields = {};
		vm.msgs = {};
        vm.list = [];
        vm.flag = false;
        vm.flag1 = false;

        vm.breakfast = [];
        vm.lunch = [];
        vm.dinner = [];
        vm.obj = {};
        vm.expanded = "false";
        vm.resources = ["X", "Y", "Z"];
        vm.resourceList = [];
        vm.service = {};

        vm.mealsArray = [vm.breakfast, vm.lunch, vm.dinner];
        vm.brkfstAvailabilty = [];
        vm.lunchAvailabilty = [];
        vm.dinnerAvailabilty = [];

        vm.days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"]
        vm.frequency = ["Breakfast", "Lunch", "Dinner"];
        vm.mealSelect = [{"day":"Sunday","type":[{"type":"breakfast","checked":false},{"type":"lunch","checked":false},{"type":"dinner","checked":false}]},{"day":"Monday","type":[{"type":"breakfast","checked":false},{"type":"lunch","checked":false},{"type":"dinner","checked":false}]},{"day":"Tuesday","type":[{"type":"breakfast","checked":false},{"type":"lunch","checked":false},{"type":"dinner","checked":false}]},{"day":"Wednesday","type":[{"type":"breakfast","checked":false},{"type":"lunch","checked":false},{"type":"dinner","checked":false}]},{"day":"Thursday","type":[{"type":"breakfast","checked":false},{"type":"lunch","checked":false},{"type":"dinner","checked":false}]},{"day":"Friday","type":[{"type":"breakfast","checked":false},{"type":"lunch","checked":false},{"type":"dinner","checked":false}]}]

        $scope.$on("data-loaded-ngo", function(obj) {
            vm.load();
        });

        vm.load = function() {
        	var breakfastflag = false;
            var lunchflag = false;
            var dinnerflag = false;
            
            vm.service = ngoEnrollmentService.serviceData;
            ngoEnrollmentService.setServiceData(vm.service);
            if(vm.service.brkfstAvailabilty != null){
            	   vm.brkfstAvailabilty = vm.service.brkfstAvailabilty.split(",");
             }
            if(vm.service.lunchAvailabilty != null){
            	vm.lunchAvailabilty = vm.service.lunchAvailabilty.split(",");
            }
            if( vm.service.dinnerAvailabilty != null){
            	vm.dinnerAvailabilty = vm.service.dinnerAvailabilty.split(",");
            }
         
            
            vm.mealSelect.forEach(function(entry) {
            	if(vm.brkfstAvailabilty.indexOf(entry.day)>-1){
            		breakfastflag =true;
            	}
            	if(vm.lunchAvailabilty.indexOf(entry.day)>-1){
            		lunchflag = true;
            	}
            	if(vm.dinnerAvailabilty.indexOf(entry.day)>-1){
            		dinnerflag = true;
            	}
            	if(breakfastflag == true || lunchflag == true || dinnerflag == true){
            		entry.type.forEach(function(typeObj) {
                        if (typeObj.type == 'breakfast' && breakfastflag==true) {
                            typeObj.checked = true;
                            breakfastflag = false;
                        } else if (typeObj.type == 'lunch' && lunchflag==true) {
                            typeObj.checked = true;
                            lunchflag = false;
                        } else if (typeObj.type == 'dinner' && dinnerflag==true) {
                            typeObj.checked = true;
                            dinnerflag = false;
                        }
                    });
            	}
            });
            
            if (vm.service && vm.service.foodBankValue && vm.service.foodBankValue != "") {
                vm.list = vm.service.foodBankValue;
                vm.service.foodBankValue = "";
            }
        }

        vm.foodBbank = function(foodBankValue) {
            if (foodBankValue != null) {
                vm.list.push(foodBankValue);
                vm.flag = true;
                vm.service.foodBankValue = " ";
            }
        }
        vm.delRow = function(index) {
            vm.list.splice(index, 1);
        }

        vm.cal = function(row, column, event) {
            var isChecked = event.currentTarget.getAttribute("class").indexOf(
                "md-checked") == -1;
            var day = vm.days[row];
            var mealType = vm.frequency[column];

            if (isChecked) {
                if (mealType == "Breakfast") {
                    vm.brkfstAvailabilty.push(day);
                } else if (mealType == "Lunch") {
                    vm.lunchAvailabilty.push(day);
                } else if (mealType == "Dinner") {
                    vm.dinnerAvailabilty.push(day);
                }
            } else {
                if (mealType == "Breakfast") {
                    var idx = vm.brkfstAvailabilty.indexOf(day);
                    vm.brkfstAvailabilty.splice(idx, 1);
                } else if (mealType == "Lunch") {
                    var idx = vm.lunchAvailabilty.indexOf(day);
                    vm.lunchAvailabilty.splice(idx, 1);
                } else if (mealType == "Dinner") {
                    var idx = vm.dinnerAvailabilty.indexOf(day);
                    vm.dinnerAvailabilty.splice(idx, 1);
                }
            }

        }

        if (vm.list) {
            vm.flag1 = true;
        }

        vm.save = function() {
            vm.mealSelect.forEach(function(entry) {
                entry.type.forEach(function(typeObj) {
                    if (typeObj.checked) {
                        if (typeObj.type == 'breakfast') {
                            vm.brkfstAvailabilty.push(entry.day);
                        } else if (typeObj.type == 'lunch') {
                            vm.lunchAvailabilty.push(entry.day);
                        } else if (typeObj.type == 'dinner') {
                            vm.dinnerAvailabilty.push(entry.day);
                        }
                    }
                });
            });

            if(vm.service){
            var data = {
                "brkfstChk": vm.service.brkfstChk ? vm.service.brkfstChk : false,
                "brkfstQty": vm.service.brkfstQty,
                "brkfstAvailabilty": vm.brkfstAvailabilty,
                "lunchChk": vm.service.lunchChk ? vm.service.lunchChk : false,
                "lunchQty": vm.service.lunchQty,
                "lunchAvailabilty": vm.lunchAvailabilty,
                "dinnerChk": vm.service.dinnerChk ? vm.service.dinnerChk : false,
                "dinnerQty": vm.service.dinnerQty,
                "dinnerAvailabilty": vm.dinnerAvailabilty,
                "baggedChk": vm.service.baggedChk ? vm.service.baggedChk : false,
                "baggedQty": vm.service.baggedQty,
                "giftCard": vm.service.giftCard,
                "other": vm.service.other,
                "monthlyBudget": vm.service.monthlyBudget,
                "operatingCost": vm.service.operatingCost,
                "personalCost": vm.service.personalCost,
                "volunteerNbr": vm.service.volunteerNbr,
                "foodStamp": vm.service.foodStamp,
                "foodBankSelect": vm.service.foodBankSelect,
                "foodBankValue": vm.list,
                "resource": vm.resourceList
            };

           
            ngoEnrollmentService.setServiceData(data);
            var serviceCalls = ngoEnrollmentService.savePartial();
            $q.all(serviceCalls) // .then(onSuccess,onError);
            $rootScope.$broadcast("scroll-tab", [1, 2]);

            }
            else{
            	$rootScope.$broadcast("scroll-tab", [1, 2]);
            }
        }

        vm.showCheckboxes = function() {
            vm.flag = "true";
        }

        vm.showCheckboxes = function() {
            vm.flag = true;
            return vm.flag;
        }

        vm.test = function() {
            vm.flag = false;
            return vm.flag;
        }

        vm.select = function(index, event) {
            var isChecked = event.target.checked;
            if (isChecked) {
                vm.resourceList.push(vm.resources[index]);
            } else {
                vm.resourceList.splice(index, 1);
            }
            console.log(vm.resourceList);
        }
        
        vm.validationCheck = function (type, id, value, event){
			if(value!=null){
				vm.fields[id] = false;
				if(type=="number"){
					if(id=="brkfstQty"){
						var brkfstQty=vm.service.brkfstQty;
						if (isNaN(Number(brkfstQty)) || brkfstQty < 0) {
							vm.fields[id] = true;
							vm.msgs[id]="Invalid Quantity";
						}else{
							vm.fields[id]=false;
						}
					}
					if(id=="lunchQty"){
						var lunchQty=vm.service.lunchQty;
						if (isNaN(Number(lunchQty)) || lunchQty < 0) {
							vm.fields[id] = true;
							vm.msgs[id]="Invalid Quantity";
						}else{
							vm.fields[id]=false;
						}
					}
					if(id=="dinnerQty"){
						var dinnerQty=vm.service.dinnerQty;
						if (isNaN(Number(dinnerQty)) || dinnerQty < 0) {
							vm.fields[id] = true;
							vm.msgs[id]="Invalid Quantity";
						}else{
							vm.fields[id]=false;
						}
					}
					
					if(id == "volunteerNbr"){
						var volunteerNbr=vm.service.volunteerNbr;
						if (isNaN(Number(volunteerNbr)) || volunteerNbr < 0) {
							vm.fields[id] = true;
							vm.msgs[id]="Invalid Quantity";
						}else{
							vm.fields[id]=false;
						}
					}
					
				}
			}	
			else{
				/*if(type=="number"){
					if((vm.service.brkfstChk && vm.service.brkfstQty == null) || (vm.service.lunchQty && vm.service.lunchQty == null) || (vm.service.dinnerQty && vm.service.dinnerQty == null)){
						vm.fields[id] = true;
						vm.msgs[id]="Please fill this field";
					}
					if(type = "other"){
						
					}
				}*/
				vm.fields[id] = true;
				vm.msgs[id]="Please fill this field";
				
			}
			
			};
        vm.validate = function(type, id, value, event){
			var data = validateFormData.validate(type, id, value, event);
			vm.fields[id] = data.field[id];
			vm.msgs[id] = data.msg[id];
		};
    }

})();