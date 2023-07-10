@isTest
public with sharing class BookingControllerTest {
    @isTest
    public static void testCreateBookingRecord(){
        List<Id> Ids = TestUtility.createShowtimeForMovie();
        Id movieId = Ids[0];
        Id showtimeId = Ids[1];

        List<String> selectedSeats = new List<String>{'A1', 'A2', 'A3'};
        List<String> selectedSeatsId = new List<String>();
        List<String> selectedSeatAssign = new List<String>();

        for(Showtime__c showtime : [SELECT (SELECT Id, Name FROM Seat_Assignments__r) FROM Showtime__c WHERE Id = :showtimeId]){
            List<Seat_Assignment__c> seatAssignments = showtime.Seat_Assignments__r;
            for(Seat_Assignment__c seatAssign : seatAssignments){
                selectedSeatsId.add(seatAssign.Id);
            }            
        }

        Test.startTest();
        Id bookingId = BookingController.createBookingRecord(showtimeId, movieId, selectedSeats, selectedSeatsId, selectedSeatAssign);
        Test.stopTest();

        Booking__c booking = [SELECT Id, Booking_Status__c, Showtime__c, Movie__c, Selected_Seats__c, Seat_Assignment_Id__c, Number_of_Seats__c FROM Booking__c WHERE Id = :bookingId];

        System.assertEquals('Pending', booking.Booking_Status__c);
        System.assertEquals(showtimeId, booking.Showtime__c);
        System.assertEquals(movieId, booking.Movie__c);
        System.assertEquals('A1,A2,A3', booking.Selected_Seats__c);
        System.assertEquals(null, booking.Seat_Assignment_Id__c);
    }

    @isTest
    public static void testGetBookingDetails(){
        Id bookingId = TestUtility.createBookingWihoutPayment();

        Test.startTest();
        Booking__c result = BookingController.getBookingDetails(bookingId);
        Test.stopTest();

        System.assertEquals(bookingId, result.Id);
        System.assertEquals('Pending', result.Booking_Status__c);
    }
}