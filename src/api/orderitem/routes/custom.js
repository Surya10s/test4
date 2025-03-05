module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/orderitems/bulk-create',  // Custom endpoint for bulk creation
        handler: 'orderitem.bulkCreate',  // Refer to the custom action in the controller
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  