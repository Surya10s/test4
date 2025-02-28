
module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'GET',
        path: '/review/aggregate/:paintId', 
        handler: 'review.getProductReviews',
      }
    ]
  }