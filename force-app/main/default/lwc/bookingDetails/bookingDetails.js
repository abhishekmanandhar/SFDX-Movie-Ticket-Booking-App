import { LightningElement, api, wire } from 'lwc';
import getBookingDetails from '@salesforce/apex/BookingController.getBookingDetails';
import getMovieDetails from '@salesforce/apex/MovieController.getMovieDetails';
import getShowtimeDetails from '@salesforce/apex/ShowtimeController.getShowtimeDetails';
import { createRecord } from 'lightning/uiRecordApi';
import PAYMENT_OBJECT from '@salesforce/schema/Payment__c';
import BOOKING_FIELD from '@salesforce/schema/Payment__c.Booking__c';
import PAYMENT_TYPE_FIELD from '@salesforce/schema/Payment__c.Payment_Type__c';
import TOTAL_PAYABLE_AMOUNT_FIELD from '@salesforce/schema/Payment__c.Total_Payable_Amount__c';

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

    get paymentTypes() {
        return [
            { label: 'Credit/Debit Card', value: 'Credit/Debit Card' },
            { label: 'Cash On Delivery', value: 'Cash On Delivery' },
        ];
    }

    selectedPaymentType = '';
    totalPayableAmount;

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

    handlePaymentTypeChange(event){
        this.selectedPaymentType = event.target.value;
        console.log(this.selectedPaymentType);
    }

    handlePayNow(){
        const fields = {};
        fields[BOOKING_FIELD.fieldApiName] = this.bookingId;
        fields[TOTAL_PAYABLE_AMOUNT_FIELD.fieldApiName] = this.totalPayableAmount;
        fields[PAYMENT_TYPE_FIELD.fieldApiName] = this.selectedPaymentType;

        const paymentRecord = { apiName: PAYMENT_OBJECT.objectApiName, fields };
        createRecord(paymentRecord)
        .then(result => {
            console.log('success')
        })
        .catch(error => {
            console.error(error)
        });
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

    get calculateDiscountAmount() {
        const discountPercentageSeats = 10; // Discount percentage for the number of seats greater >= 4
        const discountPercentageSaturday = 50; // Discount percentage for Saturday
    
        let discountAmount = 0;
    
        // Apply discount based on the number of seats
        if (this.numberOfSeats >= 4) {
            const seatsDiscount = (this.totalPrice * discountPercentageSeats) / 100;
            discountAmount += seatsDiscount;
        }
    
        // Apply discount if it's Saturday
        // const startDate = new Date(this.starttime);
        // const isSaturday = startDate.getDay() === 6;
        // if (isSaturday) {
        //     const saturdayDiscount = (this.totalPrice * discountPercentageSaturday) / 100;
        //     discountAmount += saturdayDiscount;
        // }
    
        this.totalPayableAmount = this.totalPrice - discountAmount;

        return discountAmount;
    }
    
}