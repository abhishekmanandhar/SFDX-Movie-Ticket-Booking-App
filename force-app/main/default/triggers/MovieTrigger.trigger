trigger MovieTrigger on Movie__c (before insert) {
    if(Trigger.isInsert){
        if(Trigger.isBefore){
            MovieTriggerHandler.noDuplicateMovies(Trigger.New);
        }
    }
}