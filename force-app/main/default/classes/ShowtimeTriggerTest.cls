@isTest
private class ShowtimeTriggerTest {
    @isTest
    static void testShowtimeTrigger() {
        // Create test data
        
        List<Movie__c> movies = new List<Movie__c>();
        Movie__c movie1 = new Movie__c(Name = 'The Flash');
        Movie__c movie2 = new Movie__c(Name = 'Soulmate');
		movies.add(movie1);
        movies.add(movie2);
        insert movies;
        
        Showtime__c showtime1 = new Showtime__c(Start_Time__c = DateTime.newInstanceGmt(2023, 8, 8, 10, 0, 0), Movie__c = movie1.Id);
        Showtime__c showtime2 = new Showtime__c(Start_Time__c = DateTime.newInstanceGmt(2023, 8, 8, 10, 0, 0), Movie__c = movie2.Id);
        
        Test.startTest();
        // Insert the first showtime, it should not cause an error
        insert showtime1;
        
        // Insert the second showtime, it should cause an error
        try {
            insert showtime2;
            // Fail the test if the above line did not throw an exception
            System.assert(false, 'Expected an error to be thrown');
        } catch (DmlException e) {
            // Verify that the error message matches the expected error message
            System.assertEquals('There is already a showtime for a movie at this time.', e.getDmlMessage(0));
        }
        Test.stopTest();
    }
}