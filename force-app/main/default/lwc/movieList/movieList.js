import { LightningElement, wire } from 'lwc';
import getMovies from '@salesforce/apex/MovieController.getMovies';
import getMoviesBySearchTerm from '@salesforce/apex/MovieController.getMoviesBySearchTerm';
import {NavigationMixin} from 'lightning/navigation';

export default class MovieList extends NavigationMixin(LightningElement) {
    movies = [];
    searchKey = '';
    searchMovies;
    timer;

    @wire(getMovies)
    wiredMovies({data, error}){
        if(data){
            this.movies = data;
            console.log(this.movies)
        }
        else if (error){
            console.error(error);
        }
    }

    get upcomingMovies(){
        return this.movies.filter(movie => movie.Status__c === 'Upcoming Releases');
    }

    get nowShowingMovies(){
        return this.movies.filter(movie => movie.Status__c === 'Now Showing');
    }

    searchHandler(event){
        window.clearTimeout(this.timer);
        this.searchKey = event.target.value;
        this.timer = setTimeout(() => {
            this.callApex();
        }, 1000);
    }

    callApex(){
        getMoviesBySearchTerm({searchKey: this.searchKey})
            .then(result => {
                this.searchMovies = result;
        }).catch(error => {
            console.error(error);
        })
    }

    // viewMovieDetails(event){
    //     const movieId = event.currentTarget.dataset.movieid;
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__recordPage',
    //         attributes: {
    //             recordId: movieId,
    //             objectApiName: 'Movie__c',
    //             actionName: 'view'
    //         },
    //     });
    // }
    
    viewMovieDetails(event){
        const movieId = event.currentTarget.dataset.movieid;
        var definition={
            componentDef: 'c:movieDetails',
            attributes: {
                movieId: movieId
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