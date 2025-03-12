'use strict';

/**
 * orderitem controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::orderitem.orderitem', ({ strapi }) => ({
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
          // Create the order item
          const orderItem = await strapi.service('api::orderitem.orderitem').create({ data: item });
          console.log(item);
          

          // If the order item contains a paint_id, update the paint table
          if (item.paint) {
            // Find the paint by its document ID (item.paint is the document ID)
            const paint = await strapi.service('api::paint.paint').findOne(item.paint);  // Here, item.paint is the document ID
            console.log(paint)
            const { id } = paint
            console.log(id)
            // Ensure the paint exists and there is stock available
            if (paint && paint.stock_qty > 0) {
              // Decrease the stock quantity by 1
              const updatedDocument = await strapi.entityService.update('api::paint.paint', id, {
                data: {
                  stock_qty: paint.stock_qty - item.qty,  // Subtract based on the order's quantity
                }
              },);
            } else {
              // If no stock is available, return an error
              throw new Error(`Not enough stock for paint with document ID: ${item.paint}`);
            }
          }

          return orderItem;
        })
      );

      // Return the created order items
      return ctx.send(orderItems);
    } catch (error) {
      console.error('Error creating order items:', error);
      return ctx.internalServerError('An error occurred while creating the order items');
    }
  },
}));
