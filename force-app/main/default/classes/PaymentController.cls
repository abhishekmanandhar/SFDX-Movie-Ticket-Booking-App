public with sharing class PaymentController {
    @AuraEnabled(cacheable=true)
    public static Payment__c getPaymentId(Id bookingId){
        try {
            Booking__c booking= [SELECT (SELECT Id, Name, Discount_Amount__c, Payment_Status__c, Total_Payable_Amount__c FROM Payments__r) FROM Booking__c WHERE Id = :bookingId];
            for (Payment__c payment : booking.Payments__r) {
                return payment;
            }
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @AuraEnabled(cacheable=true)
    // public static Id createPaymentRecord(Id bookingId){
    //     try {
    //         Payment__c payment = new Payment__c(Booking__c = bookingId, Payment_Status__c = 'Unpaid');
    //         insert payment;
    //         return payment.Id;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
}