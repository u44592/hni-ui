(function() {
    angular
        .module('app')
        .run(runblock);

    runblock.$inject = ['$templateCache', '$rootScope', '$state', '$mdDialog', 'authService'];

    function runblock($templateCache, $rootScope, $state, $mdDialog, authService) {
        requireAllViews(require.context('./views', true, /\.html/), ['./index.html']);
        requireAllSections(require.context('./sections', true, /\.html/));
        requireAllComponents(require.context('./components', true, /\.html/));

        $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
            if ('data' in next && 'authorizedRoles' in next.data) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!authService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                }
            }
            var state = next.name;
            
            var noAuthStates = ["landing", "join-user", "credential-setup", "agreement-policy"];
            if (noAuthStates.indexOf(state) == -1 && state != "login" && !authService.isUserLoggedIn()) {
            	event.preventDefault();
            	$state.go("login");
            }
            
            if(angular.element(document).find('md-dialog').length > 0) {
                $mdDialog.cancel();
            }
        });

        //Iterates through every file at the context passed in, except for the exclude values passed in, and pushes it onto template cache..
        function requireAllViews(items, excludes) {
            items.keys().forEach(function(key) {
                if(excludes == null) {
                    $templateCache.put(key.slice(2), require('./views/' + key.slice(2)));
                }
                else if(excludes.indexOf(key) == -1) {
                    $templateCache.put(key.slice(2), require('./views/' + key.slice(2)));
                }
            });
        }

        //Iterates through every file at the context passed in and pushes it onto template cache.
        function requireAllSections(items) {
            items.keys().forEach(function(key) {
                var index = key.slice(2).lastIndexOf('/');
                var templateName = key.slice(2).slice(index+1);

                $templateCache.put(templateName, require('./sections/' + key.slice(2)));
            });
        }

        //Iterates through every file at the context passed in and pushes it onto template cache.
        function requireAllComponents(items) {
            items.keys().forEach(function(key) {
                var index = key.slice(2).lastIndexOf('/');
                var templateName = key.slice(2).slice(index+1);

                $templateCache.put(templateName, require('./components/' + key.slice(2)));
            });
        }
    }
})();