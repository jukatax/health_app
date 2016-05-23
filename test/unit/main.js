//'use strict';
describe('Unit test controller and routes: ', function () {
        // load the controller's module
        beforeEach(module('gp'));
        //==================================================================================================
        //================================= Controller tests ===============================================
        //==================================================================================================
        describe(' booking controller testing' , function(){
                var bc, scope, getData;
                        beforeEach(
                                inject(function($controller , $rootScope , $injector , $httpBackend){
                                        scope = $rootScope.$new();
                                        bc = $controller('BookingController' , { $scope : scope});
                                        $httpBackend.expectGET('../data/data.json').respond(200 , 'main data get');
                                        $httpBackend.expectGET('views/main.html').respond(200 , 'main html');
                                        getData = $injector.get('getData');
                                        //set some dummy data to test main object
                                        scope.$apply(function(){
                                                scope.setBookingData('123' , '01/01/1234' , '3pm');
                                                scope.setGP('GP2');
                                                scope.clearBookingData();
                                        });

                                })
                        );
                        it(' getData service to be defined' , function(){
                                expect(getData).toBeDefined();

                        });
                        it(' all functions triggered on click to be defined' , function(){
                                expect(scope.setGP).toBeDefined();
                                expect(scope.setBookingData).toBeDefined();
                                expect(scope.setDoctor).toBeDefined();
                                expect(scope.clearBookingData).toBeDefined();
                                expect(scope.bookAppointment).toBeDefined();
                        });
                        it(' booking object be defined and functional' , function(){
                                expect(scope.booking.gp).toBe('');
                                expect(scope.booking.id).toBe('123');
                                expect(scope.booking.date).toBe('01/01/1234');
                                expect(scope.booking.time).toBe('3pm');
                        });
                        it(' booleans to show hide elements and disable booking button be defined and functional' , function(){
                                expect(scope.disableBooking).toBe(true);
                                expect(scope.timesVisible).toBe(false);
                                expect(scope.doctorsVisible).toBe(false);
                                expect(scope.doctor).toBeDefined();
                                expect(scope.doctors).toBeDefined();
                                expect(scope.gps).toBeDefined();
                        });
                        it(' user data should be defined' , function(){
                                expect(scope.user).toBeDefined();
                        });
        });
        //==================================================================================================
        //============================================= Testing routes =====================================
        //==================================================================================================
        describe(' test home route' , function(){
                var route, scope, location;
                beforeEach(
                        inject(function(_$location_ , _$rootScope_ , $httpBackend , _$route_){
                                scope = _$rootScope_;
                                route = _$route_;
                                location  = _$location_;
                                $httpBackend.expectGET('views/main.html').respond(200 , 'main html');
                        })
                );

                it(' should be main controller' , function(){
                        location.path('/');
                        scope.$digest();//call the digest loop
                        expect(route.current.controller).toBe('MainController');
                });
                it(' should be main controller if non existing path' , function(){
                        location.path('/bookings/adasdads');
                        scope.$digest();//call the digest loop
                        expect(route.current.controller).toBe('MainController');
                });
        });

        describe(' test booking route' , function(){
                var route, scope, location;
                beforeEach(
                        inject(function(_$location_ , _$rootScope_ , $injector , $httpBackend , _$route_){
                                scope = _$rootScope_;
                                route = _$route_;
                                location  = _$location_;
                                $httpBackend.expectGET('views/booking.html').respond(200 , 'booking html');
                        })
                );

              it(' should be booking controller' , function(){
                        location.path('/booking');
                        scope.$digest();//call the digest loop
                        expect(route.current.controller).toBe('BookingController');
                });
        });

        describe(' test booking_v2 route' , function(){
                var route, scope, location;
                beforeEach(
                        inject(function(_$location_ , _$rootScope_ , $injector , $httpBackend , _$route_){
                                scope = _$rootScope_;
                                route = _$route_;
                                location  = _$location_;
                                $httpBackend.expectGET('views/booking_v2.html').respond(200 , 'booking html');
                        })
                );

              it(' should be booking controller' , function(){
                        location.path('/booking2');
                        scope.$digest();//call the digest loop
                        expect(route.current.controller).toBe('BookingController');
                });
        });


});