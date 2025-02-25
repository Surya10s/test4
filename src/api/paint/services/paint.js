'use strict';

/**
 * paint service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::paint.paint');
