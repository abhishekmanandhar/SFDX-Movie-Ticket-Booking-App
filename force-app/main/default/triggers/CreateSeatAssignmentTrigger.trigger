trigger CreateSeatAssignmentTrigger on Showtime__c (after insert) {
    if(Trigger.isInsert){
        if(Trigger.isAfter){
            List<Seat_Assignment__c> seatAssignmentsToInsert = new List<Seat_Assignment__c>();

            for(Showtime__c showtime : Trigger.new){
                for(Seat__c seat : [SELECT Id FROM Seat__c ORDER BY Seat_Row__c, Seat_Column__c]){
                    Seat_Assignment__c seatAssignment = new Seat_Assignment__c();
                    seatAssignment.Seat__c = seat.Id;
                    seatAssignment.Showtime__c = showtime.Id;
                    seatAssignment.Availability_Status__c = 'Available';
                    seatAssignmentsToInsert.add(seatAssignment);
                }
            }

            if(!seatAssignmentsToInsert.isEmpty()){
                insert seatAssignmentsToInsert;
            }
        }
    }
}