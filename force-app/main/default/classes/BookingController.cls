public with sharing class BookingController {
    @AuraEnabled
    public static Id createBookingRecord(Id showtimeId, Id movieId, List<String> selectedSeats, List<String> selectedSeatsId, List<String> selectedSeatAssign ) {
        Booking__c booking = new Booking__c();
        // String uniqueName = 'BKG-' + String.valueOf(System.currentTimeMillis());
        // booking.Name = uniqueName;
        booking.Booking_Status__c = 'Pending';
        booking.Showtime__c = showtimeId;
        booking.Movie__c = movieId;
        booking.Selected_Seats__c = String.join(selectedSeats, ',');
        booking.Number_of_Seats__c = selectedSeats.size();

        insert booking;

        // List<Seat__c> seatsToUpdate = [SELECT Id, Avai__c FROM Seat__c WHERE Id IN :selectedSeatsId];
        // for (Seat__c seat : seatsToUpdate) {
        //     seat.Avai__c = 'On Hold';
        // }
        //update seatsToUpdate;

        List<Seat_Assignment__c> seatAssignmentsToUpdate = [SELECT Id, Availability_Status__c FROM Seat_Assignment__c WHERE Id IN :selectedSeatAssign];
        for (Seat_Assignment__c seatAssignment : seatAssignmentsToUpdate) {
            seatAssignment.Availability_Status__c = 'On Hold';
        }
        update seatAssignmentsToUpdate;

        return booking.Id;
    }

    @AuraEnabled(cacheable=true)
    public static Booking__c getBookingDetails(Id bookingId) {
        return [SELECT Name, Movie__c, Showtime__c, Number_of_seats__c, Selected_Seats__c, Total_Price__c, Ticket_Price__c, Booking_Status__c FROM Booking__c WHERE Id = :bookingId];
    }
}