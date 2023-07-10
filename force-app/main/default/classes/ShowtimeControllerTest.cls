@isTest
public with sharing class ShowtimeControllerTest {
    @isTest
    static void testGetShowtimes() {
        //creating test data
        Movie__c movie = new Movie__c(Name = 'Movie 1');
        insert movie;

        Showtime__c showtime = new Showtime__c(Start_Time__c = Date.today()+7, Theater__c = 'Theater 1', Movie__c = movie.Id);
        insert showtime;

        //calling the apex class
        Test.startTest();
        Showtime__c result = ShowtimeController.getShowtimeDetails(showtime.Id);
        Test.stopTest();

        //verifying the result
        System.assertEquals(showtime.Id, result.Id);
    }
}