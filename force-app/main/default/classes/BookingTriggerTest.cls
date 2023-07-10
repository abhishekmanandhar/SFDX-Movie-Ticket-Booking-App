@isTest
private class BookingTriggerTest {
    @isTest
    static void testBookingTrigger() {
        // Create test data
        Booking__c booking = new Booking__c(Booking_Status__c = 'Confirmed');
        
        // Set up the test context
        Test.startTest();
        insert booking;
        Test.stopTest();
        
        // Retrieve the updated booking record
        Booking__c updatedBooking = [SELECT Ticket_Price__c, Booking_Status__c FROM Booking__c WHERE Id = :booking.Id];
        
        // Verify the expected values
        System.assertEquals(200, updatedBooking.Ticket_Price__c);
        System.assertEquals('Confirmed', updatedBooking.Booking_Status__c);
    }
}
