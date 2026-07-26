const express = require('express');
const router = express.Router({ mergeParams: true });
const returnsController = require('./returns.controller');
const { validateCreateReturnRequest, validateReviewReturnRequest } = require('./returns.validator');

// Customer: initiate a return request for an order
// POST /orders/:orderId/return-requests
router.post('/orders/:orderId/return-requests', validateCreateReturnRequest, returnsController.createReturnRequest);

// Admin: list all return requests
// GET /return-requests
router.get('/return-requests', returnsController.listReturnRequests);

// Admin / Customer: get a single return request by id
// GET /return-requests/:returnRequestId
router.get('/return-requests/:returnRequestId', returnsController.getReturnRequest);

// Admin: review (approve / reject) a return request
// POST /return-requests/:returnRequestId/review
router.post('/return-requests/:returnRequestId/review', validateReviewReturnRequest, returnsController.reviewReturnRequest);

module.exports = router;
