module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/create-order',
        handler: 'razorpaytest.createOrder',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/verify-order',
        handler: 'razorpaytest.verifyPayment',
        config: {
          auth: false,
        },
      },
    ],
  };
  