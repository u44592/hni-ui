(function() {
    angular
        .module('app')
        .factory('personService', personService);

    personService.$inject = ['$http', 'serviceConstants'];

    function personService($http, serviceConstants) {
        let baseUrl = serviceConstants.baseUrl;

        return {
            getPerson,
            getAllPersons,
            postPerson,
            addToOrg,
            removeFromOrg,
            removePerson
        };

        function getPerson(orgId, roleId, success, failure) {
            $http.get(`${baseUrl}/users/organizations/${orgId}/roles/${roleId}`)
                .then(function successCallback(response) {
                    success(response);
                }, function errorCallback() {
                    failure();
                });
        }

        function getAllPersons(roleId, success) {
            $http.get(`${baseUrl}/users/organizations?roleId=${roleId}`)
                .then((response) => {
                    success(response);
                }, (error) => {
                    console.log(error);
                });
        }

        function postPerson(data, success, failure) {
            let postData = JSON.stringify(data);

            $http.post(`${baseUrl}/users`, postData)
                .then(function successCallback() {
                    success();
                }, function errorCallback() {
                    failure();
                });
        }

        function addToOrg(id, orgId, roleId) {
            $http.put(`${baseUrl}/users/${id}/organizations/${orgId}/roles/${roleId}`)
                .then((response) => {

                }, (error) => {
                    console.log(error);
                });
        }

        function removeFromOrg(id, orgId, roleId) {
            $http.delete(`${baseUrl}/users/${id}/organizations/${orgId}/roles/${roleId}`)
                .then((response) => {

                }, (error) => {
                    console.log(error);
                });
        }

        function removePerson(id, success, failure) {
            $http.delete(`${baseUrl}/users/${id}`)
                .then(function successCallback() {
                    success();
                }, function errorCallback() {
                    failure();
                });
        }
    }
})();