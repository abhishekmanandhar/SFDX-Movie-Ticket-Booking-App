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

    public static List<Id> createShowtimeForMovie(){
        Movie__c movie = new Movie__c(Name = 'Movie 1');
        insert movie;

        List<Seat__c> seatToInsert = new List<Seat__c>();
        for(Integer i = 0; i < 5; i++){
            seatToInsert.add(new Seat__c(Seat_Row__c = 'A', Seat_Column__c = i));
        }

        Database.insert(seatToInsert, true);

        Showtime__c showtime = new Showtime__c(Start_Time__c = Date.today()+7, Theater__c = 'Theater 1', Movie__c = movie.Id);
        insert showtime;

        List<Id> Ids = new List<Id>();
        Ids.add(movie.Id);
        Ids.add(showtime.Id);
    
        return Ids;
    }

    public static List<Id> createBookingWithPayment(){
        Booking__c booking = new Booking__c(Booking_Status__c = 'Pending', Number_of_Seats__c = 5);
        insert booking;

        Payment__c payment = new Payment__c(Booking__c = booking.Id);
        insert payment;

        List<Id> Ids = new List<Id>();
        Ids.add(booking.Id);
        Ids.add(payment.Id);

        return Ids;
    }

    public static Id createBookingWihoutPayment(){
        Booking__c booking = new Booking__c(Booking_Status__c = 'Pending', Number_of_Seats__c = 5);
        insert booking;

        return booking.Id;
    }

}