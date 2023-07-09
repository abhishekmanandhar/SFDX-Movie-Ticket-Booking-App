trigger PaymentTrigger on Payment__c (after update) {
    if(Trigger.isAfter){
        if(Trigger.isUpdate){
            Set<Id> bookingIds = new Set<Id>();

            for (Payment__c payment : Trigger.new) {
                if ((payment.Booking__c != null) && (payment.Payment_Status__c == 'Paid') && payment.Cancellation_Approval_Requested__c == false) {
                    bookingIds.add(payment.Booking__c);
                }
            }

            List<Booking__c> bookingsToUpdate = [SELECT Id, Seat_Assignment_Id__c FROM Booking__c WHERE Id IN :bookingIds];

            List<Seat_Assignment__c> seatAssignmentsToUpdate = new List<Seat_Assignment__c>();
            for (Booking__c booking : bookingsToUpdate) {
                booking.Booking_Status__c = 'Confirmed';
                String[] seatAssignmentIds = booking.Seat_Assignment_Id__c.split(',');
                for (String seatAssignmentId : seatAssignmentIds) {
                    seatAssignmentsToUpdate.add(new Seat_Assignment__c(Id = seatAssignmentId, Availability_Status__c = 'Reserved'));
                }
            }

            if(!bookingsToUpdate.isEmpty() && !seatAssignmentsToUpdate.isEmpty()){
                update bookingsToUpdate;
                update seatAssignmentsToUpdate;
            }
        }
    }
}