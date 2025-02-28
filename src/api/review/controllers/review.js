'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::review.review', ({ strapi }) => ({
  async getProductReviews(ctx) {
    const { paintId } = ctx.params; // Assuming `paintId` is passed as a parameter
    
    // Ensure the paintId is valid (you may want to add validation here)
    if (!paintId) {
      return ctx.badRequest('Paint ID is required');
    }

    // Fetch all reviews where the paint field matches the provided paintId
    const reviews = await strapi.entityService.findMany('api::review.review', {
      filters: { paint: paintId },
      fields: ['review'],  // Only retrieve the rating field
    });

    // Calculate the average rating
    if (reviews.length === 0) {
      return ctx.send({ averageRating: 0, totalReviews: 0 });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.review, 0);
    const averageRating = totalRating / reviews.length;

    // Respond with the average rating and total reviews count
    return ctx.send({
      averageRating: parseFloat(averageRating.toFixed(2)),  // Rounded to 2 decimal places
      totalReviews: reviews.length,
    });
  },
}));

