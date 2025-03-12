'use strict';

const Razorpay = require('razorpay');
const crypto = require('crypto'); // Import the crypto module for signature verification
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::razorpaytest.razorpaytest', ({ strapi }) => ({

  // Function to create an order
  async createOrder(ctx) {
    console.log('Received request to create order:', ctx.request.body);

    try {
      const { amount } = ctx.request.body;

      if (!amount || isNaN(amount)) {
        return ctx.throw(400, 'Invalid amount provided');
      }

      // Initialize Razorpay instance
      const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
        key_secret: process.env.RAZORPAY_KEY_SECRET, // Replace with your Razorpay secret key
      });

      const options = {
        amount: amount * 100, // Convert amount to paise (1 INR = 100 paise)
        currency: 'INR',
        receipt: `receipt#${Date.now()}`, // Generating a unique receipt ID
        payment_capture: 1, // Automatic capture of payment
      };

      // Create the Razorpay order
      const order = await razorpayInstance.orders.create(options);
      if (!order) {
        return ctx.send({ message: 'Failed to create order' }, 400);
      }

      console.log('Razorpay order created:', order);
      return ctx.send({ order });

    } catch (error) {
      console.error('Error creating order:', error);
      return ctx.throw(500, error.message || 'Something went wrong while creating the order');
    }
  },

  // Function to verify the payment
  async verifyPayment(ctx) {
    const { payment_id, order_id, signature, amount, user } = ctx.request.body;

    console.log('Received payment verification data:', {
      payment_id, order_id, signature, amount, user,
    });

    try {
      // Ensure all necessary fields are present
      if (!payment_id || !order_id || !signature || !amount || !user) {
        console.log('Missing required data:', { payment_id, order_id, signature, amount, user });
        return ctx.throw(400, 'Missing required fields');
      }

      // Generate the expected signature from the Razorpay secret key
      const body = `${order_id}|${payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      // Log signatures for debugging purposes
      console.log('Expected Signature:', expectedSignature);
      console.log('Received Signature:', signature);

      // Compare the generated signature with the one from Razorpay
      if (expectedSignature === signature) {
        // Payment is verified successfully
        console.log('Payment verified successfully');

        // Insert the payment details into the database
        const paymentData = {
          paymentId: payment_id,
          orderId: order_id,
          amount,
          users_permissions_user: user, // Assuming user is passed in the request body
          payment_status: true, // Set payment status as true if successful
        };

        const paymentRecord = await strapi.service('api::razorpaytest.razorpaytest').create({
          data: paymentData,
        });

        console.log('Payment record saved:', paymentRecord);

        // Send success response
        return ctx.send({ message: 'Payment Successful and Data Saved', success: true });
      } else {
        // Signature mismatch - potential fraud
        console.log('Payment verification failed: Signature mismatch');
        return ctx.throw(400, 'Payment verification failed');
      }

    } catch (error) {
      console.error('Error during payment verification:', error);
      return ctx.throw(500, 'Payment verification failed');
    }
  },

}));
