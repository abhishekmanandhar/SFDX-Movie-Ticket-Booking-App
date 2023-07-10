@isTest
public with sharing class ShowtimeControllerTest {
    @isTest
    static void testGetShowtimes() {
        //creating test data
        List<Id> Ids = TestUtility.createShowtimeForMovie();

        //calling the apex class
        Test.startTest();
        Showtime__c result = ShowtimeController.getShowtimeDetails(Ids[1]);
        Test.stopTest();

        //verifying the result
        System.assertEquals(Ids[1], result.Id);
    }
}