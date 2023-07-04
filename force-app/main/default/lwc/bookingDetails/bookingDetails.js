import { LightningElement, api, wire } from 'lwc';
import getBookingDetails from '@salesforce/apex/BookingController.getBookingDetails';
import getMovieDetails from '@salesforce/apex/MovieController.getMovieDetails';
import getShowtimeDetails from '@salesforce/apex/ShowtimeController.getShowtimeDetails';

export default class BookingDetails extends LightningElement {
    @api bookingId;

    movieId;
    showtimeId;
    bookingName;
    movieName;
    showtimeName;
    starttime;
    theaterName;
    selectedSeats;
    numberOfSeats;
    ticketPrice;
    totalPrice;

    bookingDetails;
    movieDetails;
    showtimeDetails;

    @wire(getBookingDetails, { bookingId: '$bookingId' })
    wiredBookingDetails({ error, data }) {
        if (data) {
            this.bookingDetails = data;
            console.log(this.bookingDetails);
            this.bookingName = this.bookingDetails.Name;
            this.movieId = this.bookingDetails.Movie__c;
            this.showtimeId = this.bookingDetails.Showtime__c;
            this.selectedSeats = this.bookingDetails.Selected_Seats__c;
            this.numberOfSeats = this.bookingDetails.Number_of_Seats__c;
            this.ticketPrice = this.bookingDetails.Ticket_Price__c;
            this.totalPrice = this.bookingDetails.Total_Price__c;

        } else if (error) {
            console.error(error);
        }
    }

    @wire(getMovieDetails, {movieId: '$movieId'})
    wireMovieDetails({error, data}) {
        if (data) {
            this.movieDetails = data;
            this.movieName = this.movieDetails.Name;
            console.log(this.movieDetails);
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getShowtimeDetails, {showtimeId: '$showtimeId'})
    wireShowtimeDetails({error, data}) {
        if (data) {
            this.showtimeDetails = data;
            this.showtimeName = this.showtimeDetails.Name;
            this.starttime = this.showtimeDetails.Start_Time__c;
            this.theaterName = this.showtimeDetails.Theater__c;
            console.log(this.showtimeDetails);
        } else if (error) {
            console.error(error);
        }
    }

    get formattedStartTime() {
        if (this.starttime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZone: 'Asia/Kathmandu',
            };
            return new Date(this.starttime).toLocaleString('en-US', options);
        }
        return '';
    }
}