public with sharing class MovieController {
    @AuraEnabled(cacheable = true)
    public static List<Movie__c> getMovies(){
        try {
            return [SELECT Id, Name, Genre__c, Duration__c, Poster_Image__c, Rating__c, Status__c FROM Movie__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static List<Movie__c> getMoviesBySearchTerm(String searchKey){
        try {
            String key = '%' + searchKey + '%';
            return [SELECT Id, Name, Poster_Image__c, Genre__c, Rating__c FROM Movie__c WHERE Name LIKE :key LIMIT 5];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static Movie__c getRelatedShowtimes(String movieId){
        try {
            return [SELECT (SELECT Id, Name, Start_Time__c, End_Time__c, Theater__c FROM Showtimes__r) FROM Movie__c WHERE Id = :movieId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Movie__c getMovieDetails(Id movieId) {
        return [SELECT Name, Cast__c, Description__c, Director__c, Genre__c, Release_Date__c, Status__c, Rating__c, Poster_Image__c FROM Movie__c WHERE Id = :movieId];
    }
}