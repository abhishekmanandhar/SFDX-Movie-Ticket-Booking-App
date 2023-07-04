public with sharing class ShowtimeController {
    @AuraEnabled(cacheable = true)
    public static Showtime__c getShowtimeDetails(String showtimeId){
        try {
            return [SELECT Name, Start_Time__c, End_Time__c, Theater__c, Available_Seats__c, Movie__c FROM Showtime__c WHERE Id = :showtimeId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}