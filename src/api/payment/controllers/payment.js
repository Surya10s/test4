'use strict';

/**
 * payment controller
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
  
  // Create order in Razorpay
  // async createOrder(ctx) {
  //   const { amount } = ctx.request.body; // Ensure amount is passed from the frontend (in paise or cents)
  
  //   const razorpayInstance = new Razorpay({
  //     key_id: process.env.RAZORPAY_KEY_ID,  // Use your Razorpay key_id
  //     key_secret: process.env.RAZORPAY_KEY_SECRET,  // Use your Razorpay key_secret
  //   });
  
  //   const options = {
  //     amount: amount * 100, // Convert to paise
  //     currency: 'INR',
  //     receipt: `order_receipt_${Date.now()}`,
  //   };
  
  //   try {
  //     const order = await razorpayInstance.orders.create(options);
  //     return ctx.send({ orderId: order.id });
  //   } catch (error) {
  //     return ctx.badRequest('Error creating order', error);
  //   }
  // },

  // // Verify payment and store the data in the payment collection
  // async verifyPayment(ctx) {
  //   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = ctx.request.body;

  //   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
  //     return ctx.badRequest('Missing payment details');
  //   }

  //   // Use the key_secret directly from the environment variables
  //   const key_secret = process.env.RAZORPAY_KEY_SECRET;

  //   // Create the body to verify signature
  //   const body = razorpay_order_id + "|" + razorpay_payment_id;

  //   // Compute the expected signature using the key_secret
  //   const expectedSignature = crypto
  //     .createHmac('sha256', key_secret)
  //     .update(body)
  //     .digest('hex');

  //   // Verify if the computed signature matches the one sent by Razorpay
  //   if (expectedSignature !== razorpay_signature) {
  //     return ctx.badRequest('Payment verification failed');
  //   }

  //   // Payment is verified, now store the payment details in Strapi
  //   try {
  //     const paymentData = {
  //       orderId: razorpay_order_id,
  //       paymentId: razorpay_payment_id,
  //       signature: razorpay_signature,
  //       status: 'success', // You can add other statuses like 'failed' depending on the response
  //       // You can add more payment info like amount, user info, etc.
  //     };

  //     // Save the payment data to Strapi payment collection
  //     const createdPayment = await strapi.entityService.create('api::payment.payment', {
  //       data: paymentData,
  //     });

  //     return ctx.send({ message: 'Payment verified and data saved', payment: createdPayment });
  //   } catch (error) {
  //     return ctx.badRequest('Error saving payment data', error);
  //   }
  // },
}));
