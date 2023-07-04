import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import getShowtimeDetails from '@salesforce/apex/ShowtimeController.getShowtimeDetails';
import createBookingRecord from '@salesforce/apex/BookingController.createBookingRecord';
import { NavigationMixin } from 'lightning/navigation';

export default class SeatDetails extends NavigationMixin(LightningElement) {
    @api showtimeId;
    movieId;
    bookingId;

    showtimeSeats;
    selectedSeats = [];
    selectedSeatsId = [];
    selectedSeatAssign = [];

    // @wire(getRelatedListRecords, {
    //     parentRecordId: '$showtimeId',
    //     relatedListId: 'Seats__r',
    //     fields: ['Seat__c.Id', 'Seat__c.Name', 'Seat__c.Avai__c', 'Seat__c.Seat_Number__c', 'Seat__c.Seat_Column__c', 'Seat__c.Seat_Row__c', 'Seat__c.isReserved__c']
    // })
    // wireRelatedSeat({ error, data }) {
    //     if (data) {
    //         this.showtimeSeats = data.records
    //         console.log(this.showtimeSeats);
    //     } else if (error) {
    //         console.error(error);
    //     }
    // }
    @wire(getRelatedListRecords, {
        parentRecordId: '$showtimeId',
        relatedListId: 'Seat_Assignments__r',
        fields: ['Seat_Assignment__c.Id' ,'Seat_Assignment__c.Name', 'Seat_Assignment__c.Showtime__c', 'Seat_Assignment__c.Seat__c', 'Seat_Assignment__c.Availability_Status__c', 'Seat_Assignment__c.isReserved__c', 'Seat_Assignment__c.Seat__r.Name', 'Seat_Assignment__c.Seat__r.Seat_Row__c', 'Seat_Assignment__c.Seat__r.Seat_Number__c', 'Seat_Assignment__c.Seat__r.Seat_Column__c',]
    })
    wireRelatedSeat({ error, data }) {
        if (data) {
            this.showtimeSeats = data.records
            console.log(this.showtimeSeats);
        } else if (error) {
            console.error(error);
        }
    }

    handleSeatSelection(event) {
        const seatId = event.target.dataset.seatid;
        const seatNumber = event.target.dataset.seatnumber;
        const seatAssign = event.target.dataset.seatassign;
        if (event.target.checked) {
            this.selectedSeatsId.push(seatId);
            this.selectedSeats.push(seatNumber);
            this.selectedSeatAssign.push(seatAssign);
            console.log("checked");
            console.log(JSON.stringify(this.selectedSeats));
            console.log(JSON.stringify(this.selectedSeatsId));
            console.log(JSON.stringify(this.selectedSeatAssign));
        } else {
            const indexofId = this.selectedSeatsId.indexOf(seatId);
            const indexofNumber = this.selectedSeats.indexOf(seatNumber);
            const indexofSeatAssign = this.selectedSeatAssign.indexOf(seatAssign);
            console.log(indexofId);
            console.log(indexofNumber);
            console.log(indexofSeatAssign);
            if (indexofId !== -1) {
                this.selectedSeats.splice(indexofId, 1);
            }
            if(indexofNumber !== -1){
                this.selectedSeatsId.splice(indexofNumber, 1);
            }
            if(indexofSeatAssign !== -1){
                this.selectedSeatAssign.splice(indexofSeatAssign, 1);
            }
            console.log(JSON.stringify(this.selectedSeats));
            console.log(JSON.stringify(this.selectedSeatsId));
            console.log(JSON.stringify(this.selectedSeatAssign));
        }
    }

    @wire(getShowtimeDetails, { showtimeId: '$showtimeId' })
    wiredShowtime({ error, data }) {
        if (data) {
            this.movieId = data.Movie__c;
            console.log(data);
        } else if (error) {
            console.error(error);
        }
    }

    handleBooking(){
        createBookingRecord({
            showtimeId: this.showtimeId,
            movieId: this.movieId,
            selectedSeats: this.selectedSeats,
            selectedSeatsId: this.selectedSeatsId,
            selectedSeatAssign: this.selectedSeatAssign
        })
        .then(result => {
            this.bookingId = result;
            console.log('Booking created', this.bookingId);
            var definition={
                componentDef: 'c:bookingDetails',
                attributes: {
                    bookingId: this.bookingId
                }
            };
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: '/one/one.app#'+btoa(JSON.stringify(definition))
                },
            });
        })
        .catch(error => {
            console.error('Error creating booking', error);
        })
    }
}