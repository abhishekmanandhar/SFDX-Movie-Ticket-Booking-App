import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { NavigationMixin } from 'lightning/navigation';
// import getRelatedShowtimes from '@salesforce/apex/MovieController.getMoviesBySearchTerm';
import NAME_FIELD from '@salesforce/schema/Movie__c.Name';
import RATING_FIELD from '@salesforce/schema/Movie__c.Rating__c';
import RELEASE_DATE_FIELD from '@salesforce/schema/Movie__c.Release_Date__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Movie__c.Description__c';
import CAST_FIELD from '@salesforce/schema/Movie__c.Cast__c';
import DIRECTOR_FIELD from '@salesforce/schema/Movie__c.Director__c';
import GENRE_FIELD from '@salesforce/schema/Movie__c.Genre__c';
import POSTER_IMAGE_FIELD from '@salesforce/schema/Movie__c.Poster_Image__c';
import DURATION_FIELD from '@salesforce/schema/Movie__c.Duration__c';

export default class MovieDetails extends NavigationMixin(LightningElement) {
    @api movieId;

    movieName;
    movieDescription;
    movieDirector;
    movieRating;
    movieReleaseDate;
    movieCast;
    movieGenre;
    moviePosterImage;
    movieDuration;
    movieShowtimes;

    @wire(getRecord, { recordId: '$movieId', fields: [NAME_FIELD, DESCRIPTION_FIELD, DIRECTOR_FIELD, RATING_FIELD, RELEASE_DATE_FIELD, CAST_FIELD, GENRE_FIELD, POSTER_IMAGE_FIELD, DURATION_FIELD] })
    wiredMovie({ error, data }) {
        if (data) {
            this.movieName = getFieldValue(data, NAME_FIELD);
            this.movieReleaseDate = getFieldValue(data, RELEASE_DATE_FIELD);
            this.movieRating = getFieldValue(data, RATING_FIELD);
            this.movieDescription = getFieldValue(data, DESCRIPTION_FIELD);
            this.movieCast = getFieldValue(data, CAST_FIELD);
            this.movieDirector = getFieldValue(data, DIRECTOR_FIELD);
            this.movieGenre = getFieldValue(data, GENRE_FIELD);
            this.moviePosterImage = getFieldValue(data, POSTER_IMAGE_FIELD);
            this.movieDuration = getFieldValue(data, DURATION_FIELD);
        } else if (error) {
            console.error(error);
        }
    }

    // @wire(getRelatedShowtimes,{ movieId: '$recordId' })
    // wiredShowtimes({error, data}){
    //     if(data){
    //         console.log(data);
    //     }
    //     else if(error){
    //         console.error(error);
    //     }
    // }

    @wire(getRelatedListRecords, {
        parentRecordId: '$movieId',
        relatedListId: 'Showtimes__r',
        fields: ['Showtime__c.Id' ,'Showtime__c.Start_Time__c', 'Showtime__c.Name', 'Showtime__c.End_Time__c', 'Showtime__c.Theater__c' ]
    })
    wireRelatedShotime({error, data}){
        if(data){
            this.movieShowtimes = data.records;
            console.log(this.movieShowtimes);
        } else if(error){
            console.error(error);
        }
    }

    viewSeatDetails(event){
        const showtimeId = event.currentTarget.dataset.showtimeid;
        var definition={
            componentDef: 'c:seatDetails',
            attributes: {
                showtimeId: showtimeId
            }
        };
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#'+btoa(JSON.stringify(definition))
            },
        });
    }
}