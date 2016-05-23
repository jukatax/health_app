
//=======================================================================
//========================== declare the app with all dependacnies ======
//=======================================================================
var app = angular.module('gp' , ['ngRoute']);

app.config(['$routeProvider' , '$locationProvider' , function ($routeProvider,$locationProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainController'
            })
            .when('/booking', {
                templateUrl: 'views/booking.html',
                controller: 'BookingController'
            })
            .when('/booking2', {
                templateUrl: 'views/booking_v2.html',
                controller: 'BookingController'
            })
            .otherwise({
                redirectTo: '/'
            });

}]);
//=======================================================================
//========================= Services    =================================
//=======================================================================
app.service('getData',["$http", function($http) {
    var url = "/API/toSendData/forBooking";
    var service = {
      get : function(){
          return $http.get("../data/data.json");
      },
      post : function(data){
          console.log(data);
          return $http.post(url , data);
      }
    };
    return service;
}]);
//=======================================================================
//========================= Controllers =================================
//=======================================================================
app.controller('MainController', [ '$route', '$scope' ,'$location' , 'getData' ,function($route ,  $scope,   $location , getData){
    //=== date manipulation ===
    $scope.curpage;
    $scope.$on('$routeChangeSuccess' , function(ev,cur,prev){
        $scope.curpage = cur.loadedTemplateUrl;
        //console.log(cur.loadedTemplateUrl);
        $scope.page = {
            name : $scope.curpage=='views/main.html'?'Home':'Booking',
            home : $scope.curpage=='views/main.html'?true:false,
            booking : $scope.curpage=='views/booking.html'?true:false,
            booking2 : $scope.curpage=='views/booking_v2.html'?true:false
        };

    });

}]);
//========== BookingController  =============
app.controller('BookingController', [ '$scope', '$filter' ,'$window','getData','$location', function( $scope, $filter, $window,  getData, $location){
    $scope.user = {
        id : '0123',
        name : 'Mr User',
        postcode : 'IG5 0LQ',
        dob : '12/12/2000',
        picture : 'http://static1.squarespace.com/static/547deff4e4b0350ed130cc8f/t/56ba1c667da24f91a8e235fa/1455037549875/Ali+Parsa.jpg'
    };
    $scope.gps = []; // all data from the JSON file after calling the server comes here
    $scope.doctors = []; //to display available doctors
    $scope.doctor =[]; // to display time tables
    $scope.doctorsVisible = false;
    $scope.timesVisible = false;
    $scope.booking = {
        gp : '',
        doctor : '',
        id : '',
        date : '',
        time : '',
        user_id : ''
    };
    $scope.disableBooking = true;


    $scope.setGP = function(gp){
        //console.log('in setGP!');
        $scope.gps.forEach(function(val,ind){
            if($scope.gps[ind].name==gp){
                $scope.doctors = $scope.gps[ind].doctors;
                //reset booking values ==
                $scope.booking.gp = '';
                $scope.booking.doctor = '';
                $scope.booking.id = '';
                $scope.booking.date = '';
                $scope.booking.time = '';
                //========================
                $scope.booking.gp = $scope.gps[ind].id;
                $scope.doctorsVisible = true;
                $scope.doctor =[];
                return true;
            }
        });
    };

    $scope.setDoctor = function(doc){
        //console.log('in setDoctor!');
        $scope.doctors.forEach(function(val,ind){
            if($scope.doctors[ind].name==doc){
                $scope.doctor = $scope.doctors[ind];
                //reset booking date/time  ==
                $scope.booking.date = '';
                $scope.booking.time ='';
                //===========================
                $scope.booking.doctor = $scope.doctor.name;
                $scope.timesVisible = true;
                $scope.doctorsVisible = false;
                return true;
            }
        });
    };

    $scope.setBookingData = function(id,date,time,personID){
        $scope.booking.id = id;
        $scope.booking.date = date;
        $scope.booking.time = time;
        $scope.booking.user_id = $scope.user.id;
        $scope.disableBooking = false;
        $scope.timesVisible = false;
    };

    $scope.clearBookingData = function(){
        $scope.disableBooking = true;

    };

    $scope.bookAppointment = function(){
        getData.post($scope.booking).then(
                function success(data){
                    console.log('Booking confirmed! ',data.data);
                    $scope.clearBookingData();
                } , function error(err){
                    console.log('Booking error, try again later! ',err);
                });
    };
    getData.get().then(
            function success(data){
                //console.log(data.data);
                $scope.gps = data.data.all;
            } , function error(err){
                console.log(err);
            });
    
}]);

app.directive('manageClicks' ,['$document' , "$window" , "$timeout" ,  function($document,$window,$timeout){
    return {
        restrict : "A",
        controller : "BookingController",
        link : function(scope,iEle,iAttr){
            var selectable = jQuery('.selectable');
            jQuery('body').on('click' , '.selectable' , function(e){
                jQuery(this).parents('.booking').addClass('active').find('.selected').removeClass('selected').end().next('.booking').find('.selected').removeClass('selected').end().end().end().addClass('selected').parents('.mainListItem').children('.date').addClass('selected');
                scope.removeSelected = function(a){
                    jQuery(a).removeClass('selected');
                };
            })
        }
    };
}]);
//=======================================================================
//============================ Socket.io ================================
//=======================================================================
var socket = io();
socket.on('doRefresh',function(){
    window.location.reload(true);
});
