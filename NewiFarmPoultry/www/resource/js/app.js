var app = angular.module('freezer', []);
app
        .run(function ($rootScope, $http) {
            $rootScope.HomeHeader = 'HomeHeader';
            $rootScope.LoginHeader = 'LoginHeader';
            $rootScope.ScheduleHeader = 'ScheduleHeader';
            $rootScope.ReceiptHeader = 'ReceiptHeader';
            $rootScope.NewCustomerHeader = 'NewCustomerHeader';
            $rootScope.OrderHeader = 'OrderHeader';
            $rootScope.MessageHeader = 'MessageHeader';
            $rootScope.FreezerHeader = 'FreezerHeader';
            $rootScope.ProductHeader = 'ProductHeader';
            $rootScope.InformationHeader = 'InformationHeader';
            $rootScope.SettingsHeader = 'SettingsHeader';


            $rootScope.backToLogin = 'BackToLogin';
            $rootScope.backToHome = 'BackToHome';
        });

