public with sharing class ShowtimeController {
    @AuraEnabled(cacheable = true)
    public static Showtime__c getShowtimeDetails(String showtimeId){
        return [SELECT Name, Start_Time__c, End_Time__c, Theater__c, Available_Seats__c, Seats_on_Hold__c, Movie__c FROM Showtime__c WHERE Id = :showtimeId];
    }
}