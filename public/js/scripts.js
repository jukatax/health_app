
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
          return $http.get("data/data.json");
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
    //=== route change ===
    $scope.curpage;
    $scope.$on('$routeChangeSuccess' , function(ev,cur,prev){
        $scope.curpage = cur.loadedTemplateUrl;
        $scope.page = {
            name : $scope.curpage=='views/main.html'?'Home':'Booking',
            home : $scope.curpage=='views/main.html'?true:false,
            booking : $scope.curpage=='views/booking.html'?true:false,
            booking2 : $scope.curpage=='views/booking_v2.html'?true:false
        };

    });

}]);
//===================================
//========== BookingController  =====
//===================================
app.controller('BookingController', [ '$scope', '$filter' ,'$window','getData','$location', function( $scope, $filter, $window,  getData, $location){
    $scope.user = {
        id : '0123',
        name : 'Mr User',
        postcode : 'IG5 0LQ',
        dob : '12/12/2000',
        picture : 'images/yuliyan.jpg'
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
                $scope.gps = data.data.all;
            } , function error(err){
                console.log(err);
            });
    
}]);

//=================================================================================================
//========== directive to manage any DOM manipulation - clicks to change classes  =================
//=================================================================================================
app.directive('manageClicks' ,['$document' , "$window" , "$timeout" ,  function($document,$window,$timeout){
    return {
        restrict : "A",
        controller : "BookingController",
        link : function(scope,iEle,iAttr){
            var selectable = jQuery('.selectable');
            jQuery('body').on('click touchstart' , '.selectable' , function(e){
                jQuery(this).parents('.booking').addClass('active').find('.selected').removeClass('selected').end().next('.booking').find('.selected').removeClass('selected').end().end().end().addClass('selected').parents('.mainListItem').children('.date').addClass('selected');
                scope.removeSelected = function(a){
                    jQuery(a).removeClass('selected');
                };
            })
        }
    };
}]);

app.directive('menuClicks' ,['$document' , "$window" ,  function($document,$window){
    return {
        restrict : "A",
        link : function(scope,iEle,iAttr){
            var ww,evnt;
            function getWindowWidth(){
                ww = document.body.clientWidth || document.documentElement.clientWidth;
                if(ww>768){
                    evnt = 'click';
                }else{
                    evnt = 'click';
                }
                console.log(ww);
                jQuery('body').off(evnt).on(evnt , '.mobileToggle , header nav ul li' , function(e){
                    jQuery('header nav ul li').toggleClass('menuShow');
                })
            }
            getWindowWidth();

            jQuery($window).resize(function(){
                getWindowWidth();
            });


        }
    };
}]);
app.directive('popupOffset' ,['$document' , "$window" ,  function($document,$window){
    return {
        restrict : "A",
        link : function(scope,iEle,iAttr){
            var ww,st,elw;
            var popup = jQuery('.overlay .popup');
            function setPopupOffset(){
                st = document.body.scrollTop || document.documentElement.scrollTop;
                ww = document.body.clientWidth || document.documentElement.clientWidth;
                elw = (ww- popup.width())/2;
                popup.css({'top' : (st+10)+'px' , 'left' : elw+'px'});
            }
            setPopupOffset();

            jQuery($window).off('scroll resize').on('scroll resize' , function(){
                setPopupOffset();
            });


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
