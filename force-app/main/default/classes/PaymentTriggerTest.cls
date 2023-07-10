@isTest
private class PaymentTriggerTest {
    @isTest
    static void testPaymentTrigger() {
        // Create test data
        Booking__c booking = new Booking__c(Booking_Status__c = 'Pending', Seat_Assignment_Id__c = 'A1,A2,A3');
        insert booking;
        
        Payment__c payment = new Payment__c(Booking__c = booking.Id, Payment_Status__c = 'In Progress', Cancellation_Approval_Requested__c = false);
        insert payment;

        Payment__c paymentToUpdate = [SELECT Payment_Status__c FROM Payment__c WHERE Id = :payment.Id];
        paymentToUpdate.Payment_Status__c = 'Paid';

        // Set up the test context
        Test.startTest();
        update paymentToUpdate;
        Test.stopTest();
        
        // Retrieve the updated booking records
        List<Booking__c> updatedBookings = [SELECT Id, Booking_Status__c FROM Booking__c WHERE Id = :booking.Id];
        
        // Retrieve the updated seat assignment records
        List<Seat_Assignment__c> updatedSeatAssignments = [SELECT Id, Availability_Status__c FROM Seat_Assignment__c WHERE Id IN :booking.Seat_Assignment_Id__c.split(',')];
        
        // Verify the expected values
        for (Booking__c updatedBooking : updatedBookings) {
            System.assertEquals('Confirmed', updatedBooking.Booking_Status__c);
        }
        
        for (Seat_Assignment__c updatedSeatAssignment : updatedSeatAssignments) {
            System.assertEquals('Reserved', updatedSeatAssignment.Availability_Status__c);
        }
    }
}
