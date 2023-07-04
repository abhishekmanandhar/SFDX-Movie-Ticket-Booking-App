trigger BookingTrigger on Booking__c (before insert) {
    public static final Integer TICKET_PRICE = 200;
    
    if(Trigger.isBefore){
        if(Trigger.isInsert){
            for (Booking__c booking : Trigger.new) {
                booking.Ticket_Price__c = TICKET_PRICE;
            }
        }
    }
}