public with sharing class UpdateSeatAssignment {
    @InvocableMethod(label='Update Seat Assignment' description='It updates the seat assignment status to available' category='Update Seat Assignment' )
    public static void updateSeatAssignAvailable(List<String> selectedSeatAssign){
        if (selectedSeatAssign != null && !selectedSeatAssign.isEmpty()) {
            String seatAssignIds = selectedSeatAssign[0];
            
            List<String> seatAssignmentIdsList = seatAssignIds.split(',');
            
            List<Seat_Assignment__c> seatAssignmentsToUpdate = [SELECT Id, Availability_Status__c FROM Seat_Assignment__c WHERE Id IN :seatAssignmentIdsList];
            for (Seat_Assignment__c seatAssignment : seatAssignmentsToUpdate) {
                seatAssignment.Availability_Status__c = 'Available';
            }
            
            update seatAssignmentsToUpdate;
        }
    }
}