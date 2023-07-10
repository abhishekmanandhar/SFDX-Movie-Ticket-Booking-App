public class TestUtility {
	public static List<Movie__c> createMovies(Integer count) {
        List<Movie__c> movies = new List<Movie__c>();
        for (Integer i = 0; i < count; i++) {
        	movies.add(createMovie('Movie ' + i, 'Action', 120, '7.5'));
        }
        return movies;
    }

    public static Movie__c createMovie(String name, String genre, Integer duration, String rating) {
        return new Movie__c(Name = name, Genre__c = genre, Duration__c = duration, Rating__c = rating);
    }
    
    public static void assertMovieFields(Movie__c movie, String expectedName, String expectedGenre, String expectedRating) {
        System.assertEquals(expectedName, movie.Name);
        System.assertEquals(expectedGenre, movie.Genre__c);
        System.assertEquals(expectedRating, movie.Rating__c);
    }
}