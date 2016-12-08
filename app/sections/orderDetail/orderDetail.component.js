(function () {
    angular
        .module('app')
        .component('orderDetail', {
            bindings: {},
            templateUrl: 'order-detail.tpl.html',
            controller: OrderDetailController,
            controllerAs: 'vm'
        });

    OrderDetailController.$inject = ['$element', '$document', '$window','$scope', '$interval', 'ordersService', 'timeoutService', 'selectedNavItemService'];

    function OrderDetailController($element, $document, $window, $scope, $interval, ordersService, timeoutService, selectedNavItemService) {
        let vm = this;

        let lockGetInitialOrder = false;
        let initialOrderInterval = null;

        vm.orderInfo = {};
        vm.paymentInfo = {};
        vm.showPaymentInfo = true;
        vm.orderShown = false;

        vm.placeOrder = placeOrder;
        vm.getMoreFunds = getMoreFunds;

        vm.$onInit = function() {
            setContainerHeight();
            selectedNavItemService.setSelectedItem("orders");
            ordersService.getInitialOrder(getInitialSuccess);

            //Cancels timeouts and intervals on leaving scope.
            $scope.$on('$destroy', () => {
                $interval.cancel(initialOrderInterval);
                timeoutService.cancelTimeout();
            });

            //Unlocks order on state change.
            $scope.$on('$stateChangeStart', () => {
                if(vm.orderInfo.orderId) {
                    ordersService.unlockOrder(vm.orderInfo.orderId);
                }

                $window.onbeforeunload = undefined;
            });

            //Unlocks order on refresh/browser close/tab close. Needs xmlhttp call to force the call to be synchronous.
            $window.onbeforeunload = function() {
                if(vm.orderInfo.orderId) {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("DELETE", `${serviceConstants.baseUrl}/orders/lock/${vm.orderInfo.orderId}`, false);
                    xmlhttp.setRequestHeader("Content-type", "application/json");
                    xmlhttp.setRequestHeader("X-hni-token", authService.getToken());
                    xmlhttp.send();
                }

                return null;
            };
        };

        //Sets data from first get orders call. If no data, sets interval to call the function until data exists.
        function getInitialSuccess(response) {
            if(response.status !== 204) {
                let data = response.data;

                vm.orderInfo.orderId = data.id;
                vm.orderInfo.totalCost = data.subTotal;
                vm.orderInfo.userName = `${data.user.firstName} ${data.user.lastName.charAt(0).toUpperCase()}.`;
                vm.orderInfo.providerId = data.providerLocation.provider.id;
                vm.orderInfo.providerName = data.providerLocation.provider.name;
                vm.orderInfo.providerAddress = data.providerLocation.address.address1;
                vm.orderInfo.providerCity = capitalizeFirstLetter(data.providerLocation.address.city);
                vm.orderInfo.providerWebsite = data.providerLocation.provider.websiteUrl;
                vm.orderInfo.providerState = data.providerLocation.address.state.toUpperCase();
                vm.orderInfo.orderItems = [];
                vm.orderInfo.orderTime = formatTime(data.orderDate);

                angular.forEach(data.orderItems, (item) => {
                    let index = vm.orderInfo.orderItems.map((orderItem) => {
                        if(item.menuItem) {
                            return item.menuItem.name;
                        }
                        else {
                            return null;
                        }
                    }).indexOf(item.menuItem.name);

                    if(index === -1) {
                        vm.orderInfo.orderItems.push({name: item.menuItem.name, description: item.menuItem.description,quantity: 1});
                    }
                    else {
                        vm.orderInfo.orderItems[index].quantity += 1;
                    }
                });

                ordersService.getPaymentDetails(vm.orderInfo.orderId)
                    .then((response) => {
                        setPaymentInfo(response.data);
                    });

                lockGetInitialOrder = false;
                vm.orderShown = true;
                vm.loadingOrderShown = false;

                $interval.cancel(initialOrderInterval);
                timeoutService.startTimeout(900000);
            }
            else if(!lockGetInitialOrder) {
                lockGetInitialOrder = true;
                vm.orderShown = false;
                vm.loadingOrderShown = true;

                initialOrderInterval = $interval(() => {
                    ordersService.getInitialOrder(getInitialSuccess);
                }, 15000)
            }
        }

        function placeOrder() {
            $window.open(vm.orderInfo.providerWebsite, '_blank');
        }

        function setPaymentInfo(data) {
            vm.paymentInfo.orderId = vm.orderInfo.orderId;
            vm.paymentInfo.amount = (Math.round((data.amount) * 100 ) / 100);
            vm.paymentInfo.paymentInstrumentId = data.id.paymentInstrument.id;
            vm.paymentInfo.cardNumber = data.id.paymentInstrument.cardNumber;
            vm.paymentInfo.pinNumber = data.id.paymentInstrument.pinNumber;
        }

        function getMoreFunds() {
            vm.showPaymentInfo = false;

            ordersService.getPaymentDetails(vm.orderInfo.orderId)
                .then((response) => {
                    setPaymentInfo(response.data);
                    vm.showPaymentInfo = true;
                });
        }

        //formats epoch time to hours + minutes
        function formatTime(value) {
            let date = new Date(value);
            let time = (`${date.getHours()}:${date.getMinutes()}`).split(':');

            let hours = Number(time[0]);
            let minutes = Number(time[1]);

            let timeValue = "" + ((hours >12) ? hours - 12 : hours);
            timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;

            timeValue += (hours >= 12) ? 'pm' : "am";

            return timeValue;
        }

        function capitalizeFirstLetter(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }

        function setContainerHeight() {
            if(vm.orderShown) {
                $document.ready(function() {
                    let orderDetailContainer = $element[0].querySelector('.order-detail-info-container');
                    let footerHeight = $element[0].querySelector('.order-detail-footer').offsetHeight;
                    let headerBarHeight = $element[0].querySelector('.order-header-bar').offsetHeight;
                    let topNavHeight = $document[0].querySelector('#top-nav').offsetHeight;

                    orderDetailContainer.style.height = `calc(100vh - ${footerHeight}px - ${headerBarHeight}px - ${topNavHeight}px)`;
                });
            }
        }
    }
})();