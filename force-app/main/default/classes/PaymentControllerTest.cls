@isTest
public with sharing class PaymentControllerTest {
    @isTest
    static void testGetPaymentId(){
        //creating test data
        Id bookingId = TestUtility.createBookingWithPayment();

        //calling the apex class
        Test.startTest();
        Payment__c result = PaymentController.getPaymentId(bookingId);
        Test.stopTest();

        //asserting the result
        System.assertEquals(payment.Id, result.Id);
    }
    
    @isTest
    static void testGetPaymentIdNull(){
        //creating test data
        Id bookingId = TestUtility.createBookingWithPayment();
        
        //calling the apex class
        Test.startTest();
        Payment__c result = PaymentController.getPaymentId(booking.Id);
        Test.stopTest();

        //asserting the result
        System.assertEquals(null, result);
    }
}