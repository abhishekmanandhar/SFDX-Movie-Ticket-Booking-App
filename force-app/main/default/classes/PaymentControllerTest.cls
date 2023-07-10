@isTest
public with sharing class PaymentControllerTest {
    @isTest
    static void testGetPaymentId(){
        //creating test data
        Booking__c booking = new Booking__c(Booking_Status__c = 'Pending', Number_of_Seats__c = 5);
        insert booking;

        Payment__c payment = new Payment__c(Booking__c = booking.Id);
        insert payment;

        //calling the apex class
        Test.startTest();
        Payment__c result = PaymentController.getPaymentId(booking.Id);
        Test.stopTest();

        //asserting the result
        System.assertEquals(payment.Id, result.Id);
    }
    
    @isTest
    static void testGetPaymentIdNull(){
        //creating test data
        Booking__c booking = new Booking__c(Booking_Status__c = 'Pending', Number_of_Seats__c = 5);
        insert booking;
        
        //calling the apex class
        Test.startTest();
        Payment__c result = PaymentController.getPaymentId(booking.Id);
        Test.stopTest();

        //asserting the result
        System.assertEquals(null, result);
    }
}