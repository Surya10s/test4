'use strict';

/**
 * orderitem controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::orderitem.orderitem',({strapi})=>({




    async bulkCreate(ctx) {
        // Get the data from the request body
        const { data } = ctx.request.body;
    
        if (!Array.isArray(data)) {
          return ctx.badRequest('The data must be an array of order items');
        }
    
        try {
          // Create all the order items in bulk
          const orderItems = await Promise.all(
            data.map(async (item) => {
              return await strapi.service('api::orderitem.orderitem').create({ data: item });
            })
          );
    
          // Return the created order items
          return ctx.send(orderItems);
        } catch (error) {
          console.error('Error creating order items:', error);
          return ctx.internalServerError('An error occurred while creating the order items');
        }
}}));
