@isTest
public with sharing class PaymentControllerTest {
    @isTest
    static void testGetPaymentId(){
        //creating test data
        List<Id> Ids = TestUtility.createBookingWithPayment();

        //calling the apex class
        Test.startTest();
        Payment__c result = PaymentController.getPaymentId(Ids[0]);
        Test.stopTest();

        //asserting the result
        System.assertEquals(Ids[1], result.Id);
    }
    
    @isTest
    static void testGetPaymentIdNull(){
        //creating test data
        Id bookingId = TestUtility.createBookingWihoutPayment();
        
        //calling the apex class
        Test.startTest();
        Payment__c result = PaymentController.getPaymentId(bookingId);
        Test.stopTest();

        //asserting the result
        System.assertEquals(null, result);
    }
}