@isTest
public with sharing class ShowtimeControllerTest {
    @isTest
    static void testGetShowtimes() {
        //creating test data
        Id showtimeId = TestUtility.createShowtimeForMovie();

        //calling the apex class
        Test.startTest();
        Showtime__c result = ShowtimeController.getShowtimeDetails(showtimeId);
        Test.stopTest();

        //verifying the result
        System.assertEquals(showtime.Id, result.Id);
    }
}