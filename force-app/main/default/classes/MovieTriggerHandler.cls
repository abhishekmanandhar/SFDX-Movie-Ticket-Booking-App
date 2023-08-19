public class MovieTriggerHandler {
    public static void noDuplicateMovies(List<Movie__c> newMovieList){
        for(Movie__c newMovie : newMovieList){
            for(Movie__c existingMovie : [SELECT Name FROM Movie__c]){
                if(newMovie.Name == existingMovie.Name){
                    newMovie.addError('Name', 'Movie with the same name already exists');
                }
            }
        }
    }
}