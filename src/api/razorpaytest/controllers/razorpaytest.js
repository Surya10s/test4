'use strict';

const Razorpay = require('razorpay');
const crypto = require('crypto'); // Import the crypto module for signature verification
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::razorpaytest.razorpaytest', ({ strapi }) => ({
  
  // Function to create an order
  async createOrder(ctx) {
    console.log(ctx.request.body);
    try {
      // Initialize Razorpay instance
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
        key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay secret key
      });

      const options = {
        amount: ctx.request.body.amount * 100, // Amount in paise (e.g., for 100 INR, send 10000)
        currency: 'INR',
        receipt: 'receipt#1', // Optional, you can generate unique receipts
        payment_capture: 1, // 1 for automatic capture
      };

      // Create the order asynchronously using promises
      const order = await new Promise((resolve, reject) => {
        instance.orders.create(options, function (err, order) {
          if (err) {
            reject(err);
          } else {
            resolve(order);
          }
        });
      });

      if (!order) {
        return ctx.send({ message: 'No order created' }, 400); // If no order, send error message
      }

      // Send created order back in response
      return ctx.send({ order });

    } catch (error) {
      console.error('Error:', error);
      return ctx.throw(500, error.message || 'Something went wrong');
    }
  },

  // Function to verify the payment
  async verifyPayment(ctx) {
    const { payment_id, order_id, signature, amount, user } = ctx.request.body;
  
    // Log all incoming data for debugging purposes
    console.log('Incoming payment data:', {
      payment_id,
      order_id,
      signature,
      amount,
      user,
    });
  
    try {
      if (!payment_id || !order_id || !signature || !amount || !user) {
        console.log('Missing data:', { payment_id, order_id, signature, amount, user });
        return ctx.throw(400, 'Missing required fields');
      }
  
      // Create a string to compare the signature sent by Razorpay
      const body = order_id + "|" + payment_id;
  
      // Generate the expected signature using Razorpay's key secret
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
  
      console.log('Expected Signature:', expectedSignature);
      console.log('Received Signature:', signature);
  
      // Compare the signatures
      if (expectedSignature === signature) {
        // Payment is verified
        console.log('Payment Verified');
  
        // Insert the payment data into the razorpaytest table
        const paymentData = {
          paymentId: payment_id,
          orderId: order_id,
          amount,
          users_permissions_user: user, // Assuming 'user' is passed in the request body
          payment_status: true, // You can add other relevant status values if needed
        };
  
        // Insert payment data into razorpaytest model
        const paymentRecord = await strapi.service('api::razorpaytest.razorpaytest').create({
          data: paymentData,
        });
  
        console.log('Payment data saved:', paymentRecord);
  
        // Send success response to the client
        return ctx.send({ message: 'Payment Successful and Data Saved', success: true });
      } else {
        // Signature mismatch, possible fraudulent transaction
        console.log('Signature mismatch');
        return ctx.throw(400, 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error during payment verification:', error);
      return ctx.throw(500, 'Payment verification failed');
    }
  }
  
}));
