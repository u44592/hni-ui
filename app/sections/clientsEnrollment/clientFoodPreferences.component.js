(function() {
	angular
		.module('app')
		
		 .directive('clientFoodPreferences', clientFoodPreferencesDirective)
	
	
	function clientFoodPreferencesDirective() {
		return {
			scope : {
				
			},
			restrict : "E",
			templateUrl : "clientFoodPreferences.tpl.html",
			controller : clientFoodPreferencesController,
			 controllerAs: 'vm'
		}
	}
	
	clientFoodPreferencesController.inject = ['$q','clientEnrollmentService','$scope','$rootScope','$state'];
	
	function clientFoodPreferencesController($q,clientEnrollmentService,$scope,$rootScope,$state){
    	var vm = this;
    	
    	vm.mealsPerDayList = [
    		{id: 0, name: "0"},
			{id: 1, name: "1"},
			{id: 2, name: "2"},
			{id: 3, name: "3"},
			{id: 4, name: "More than 3"}
    	];
    	
    	vm.foodPreferenceList = [
    		{id: 0, name: "vegetarian"},
			{id: 1, name: "pescatarian"},
			{id: 2, name: "organic"},
			{id: 3, name: "gluten free"},
			{id: 4, name: "vegan"},
			{id: 5, name: "paleo"},
			{id: 6, name: "no preference"}
    	];
    	
    	vm.distanceList = [
    		{id: 0, name: "0-2"},
			{id: 1, name: "2-5"},
			{id: 2, name: "5-10"},
			{id: 3, name: "more than 10"}
    	];
    	
    	vm.travelTimeList = [
    		{id: 0, name: "0-5"},
			{id: 1, name: "5-10"},
			{id: 2, name: "10-30"},
			{id: 3, name: "more than 30"}
    	];
    	
    	vm.subFoodProgramExpList = [
    		{id: 0, name: "great"},
			{id: 1, name: "good"},
			{id: 2, name: "ok"},
			{id: 3, name: "fair"},
			{id: 4, name: "poor"}
    	];
    	//vm.food = clientEnrollmentService.foodPreferences;
    	vm.save = function(){ 
    	var data = {
    		    "mealsPerDay": vm.food.mealsPerDay.id,
    		    "foodPreference": vm.food.foodPreference.id,
    		    "foodSource": vm.food.foodSource,
    		    "cook": vm.food.cook,
    		    "travelForFoodDistance": vm.food.travelForFoodDistance.id,
    		    "travalForFoodTime": vm.food.travalForFoodTime.id,
    		    "subFoodProgram": vm.food.subFoodProgram,
    		    "subFoodProgramEntity": vm.food.subFoodProgramEntity,
    		    "subFoodProgramDuration": vm.food.subFoodProgramDuration,
    		    "subFoodProgramRenew": vm.food.subFoodProgramRenew,
    		    "subFoodProgramExp": vm.food.subFoodProgramExp.id 
    			}
    	console.log(data);
    	 clientEnrollmentService.setFoodData(data);
		 //var serviceCalls = ngoEnrollmentService.savePartial();
    	}
	}
})();