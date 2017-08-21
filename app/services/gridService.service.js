(function() {
    angular
        .module('app')
        .factory('gridService', gridService);

    gridService.$inject = ['$http','serviceConstants'];

    function gridService($http,serviceConstants) {
    	let baseUrl = serviceConstants.baseUrl;
        return {
        	activation: activation,
        	activateUser : activateUser,
        	sheltered : sheltered,
        	deletion : deletion,
        	deleteMultiple : deleteMultiple 
        };

        function activation(data, value) {
        	if(!value)
        		return $http.post(`${baseUrl}/configure/users/activate`, data);
        	else
        		return $http.post(`${baseUrl}/configure/users/de-activate`, data);
        }
        
        function activateUser(data, value) {
        	if(!value)
        		return $http.post(`${baseUrl}/configure/user/activate`, data);
        	else
        		return $http.post(`${baseUrl}/configure/user/de-activate`, data);
        }
        
        function sheltered(data, value) {
        	if(!value)
        		return $http.post(`${baseUrl}/configure/user/sheltered`, data);
        	else
        		return $http.post(`${baseUrl}/configure/user/un-sheltered`, data);
        }
        
        function deletion(id) {
        	return $http.post(`${baseUrl}/configure/user/delete`, id);
        }
        
        function deleteMultiple(id) {
        	return $http.post(`${baseUrl}/configure/users/delete`, id);
        }
        
    }
})();