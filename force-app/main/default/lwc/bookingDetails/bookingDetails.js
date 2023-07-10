import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getBookingDetails from '@salesforce/apex/BookingController.getBookingDetails';
import getMovieDetails from '@salesforce/apex/MovieController.getMovieDetails';
import getShowtimeDetails from '@salesforce/apex/ShowtimeController.getShowtimeDetails';
import getPaymentId from '@salesforce/apex/PaymentController.getPaymentId';
// import createPaymentRecord from '@salesforce/apex/PaymentController.createPaymentRecord';
import { updateRecord } from 'lightning/uiRecordApi';
import PAYMENT_OBJECT from '@salesforce/schema/Payment__c';
import PAYMENT_ID_FIELD from '@salesforce/schema/Payment__c.Id';
import PAYMENT_TYPE_FIELD from '@salesforce/schema/Payment__c.Payment_Type__c';
import PAYMENT_STATUS_FIELD from '@salesforce/schema/Payment__c.Payment_Status__c'

export default class BookingDetails extends NavigationMixin(LightningElement) {
    @api bookingId;

    movieId;
    showtimeId;
    bookingName;
    movieName;
    posterImage;
    showtimeName;
    starttime;
    theaterName;
    seatsOnHold;
    selectedSeats;
    numberOfSeats;
    ticketPrice;
    totalPrice;
    
    bookingDetails;
    movieDetails;
    showtimeDetails;
    
    
    //For Payment
    selectedPaymentType = '';
    paymentId;
    discountAmount;
    totalPayableAmount;

    get paymentTypes() {
        return [
            { label: 'Credit/Debit Card', value: 'Credit/Debit Card' },
            { label: 'Mobile Wallet', value: 'Mobile Wallet' },
        ];
    }

    // @wire(createPaymentRecord, { bookingId: '$bookingId' })
    // wiredPaymentRecord({ error, data }) {
    //     if (data) {
    //        console.log(data);
    //     } else if (error) {
    //         this.showToast('Error', error.body.message, 'error');
    //         console.error(error);
    //     }
    // }    
    
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
            this.posterImage = this.movieDetails.Poster_Image__c;
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
            this.seatsOnHold = this.showtimeDetails.Seats_on_Hold__c;
            console.log(this.showtimeDetails);
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getPaymentId, {bookingId: '$bookingId'})
    wirePaymentId({data, error}) {
        if(data) {
            this.paymentId = data.Id;
            this.discountAmount = data.Discount_Amount__c;
            this.totalPayableAmount = data.Total_Payable_Amount__c;
            console.log(data);
        }
        else if(error) {
            console.error(error);
        }
    }

    handlePaymentTypeChange(event){
        this.selectedPaymentType = event.target.value;
        console.log(this.selectedPaymentType);
    }

    handlePayNow(){
        const fields = {};
        fields[PAYMENT_ID_FIELD.fieldApiName] = this.paymentId;
        fields[PAYMENT_TYPE_FIELD.fieldApiName] = this.selectedPaymentType;
        fields[PAYMENT_STATUS_FIELD.fieldApiName] = 'Paid';

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(result => {
                console.log('success');
                this.showToast('Success', 'Congratulation! Payment was successful. Check your mail for the ticket details!', 'success')
                this[NavigationMixin.Navigate]({
                    type: "standard__recordPage",
                    attributes: {
                      objectApiName: "Payment__c",
                      actionName: "view",
                      recordId: this.paymentId
                    }
                  });   
            })
            .catch(error => {
                console.log('error');
                this.showToast('Error', error.body.message, 'error');
            });
    }

    handlePayLater(){

        const fields = {};
        fields[PAYMENT_ID_FIELD.fieldApiName] = this.paymentId;
        fields[PAYMENT_STATUS_FIELD.fieldApiName] = 'Unpaid';

        const recordInput = { fields };

        console.log(this.seatsOnHold + this.numberOfSeats);
        
        if(this.seatsOnHold + this.numberOfSeats <= 10){
            updateRecord(recordInput)
                .then(result => {
                    console.log('success');
                    this.showToast('Success', 'You have an hour to pay for the movie tickets', 'success')
                    this[NavigationMixin.Navigate]({
                        type: "standard__recordPage",
                        attributes: {
                          objectApiName: "Payment__c",
                          actionName: "view",
                          recordId: this.paymentId
                        }
                      });
                })
                .catch(error => {
                    console.log('error');
                    this.showToast('Error', error.body.message, 'error');
                });
        } else{
            this.showToast('Error', 'Sorry! The limit of seats on hold exceeded. Pay Now to book your tickets', 'error');
        }
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
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