@isTest
public class MovieControllerTest {

    @isTest
    static void testGetMovies() {
        List<Movie__c> movies = TestUtility.createMovies(5);
		
        insert movies;
        
        Test.startTest();
        List<Movie__c> result = MovieController.getMovies();
        Test.stopTest();

        System.assertEquals(5, result.size());
        for (Integer i = 0; i < 5; i++) {
            TestUtility.assertMovieFields(result[i], 'Movie ' + i, 'Action', '7.5');
        }
    }
    
    @isTest
    static void testGetMoviesBySearchTerm(){
        List<Movie__c> movies = TestUtility.createMovies(5);
        
        insert movies;
        
        Test.startTest();
        List<Movie__c> result = MovieController.getMoviesBySearchTerm('2');
        Test.stopTest();
        
        System.assertEquals(1, result.size());
		TestUtility.assertMovieFields(result[0], 'Movie 2', 'Action', '7.5');    
    }
    
    @isTest
    static void testGetMovieDetails(){
        Movie__c movie = new Movie__c(Name = 'Movie 1', 
                                      Cast__c = 'Actor 1',
                                      Description__c = 'Description 1',
                                      Director__c = 'Director 1',
                                      Genre__c = 'Action',
                                      Release_Date__c = Date.today(),
                                      Rating__c = '7');
       	insert movie;
        
        Test.startTest();
        Movie__c result = MovieController.getMovieDetails(movie.Id);
        Test.stopTest();
        
        System.assertEquals('Movie 1', result.Name);
	}
}