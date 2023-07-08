trigger ShowtimeTrigger on Showtime__c (before insert) {
    if(Trigger.isInsert){
        if(Trigger.isBefore){
            List<Showtime__c> showtimes = [SELECT Start_Time__c FROM Showtime__c];

            for(Showtime__c showtime : Trigger.new){
                for(Showtime__c showtime2 : showtimes){
                    if(showtime.Start_Time__c == showtime2.Start_Time__c){
                        showtime.addError('There is already a showtime for a movie at this time.');
                    }
                }
            }
        }
    }
}