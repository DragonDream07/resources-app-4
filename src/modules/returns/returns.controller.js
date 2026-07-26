const returnsService = require('./returns.service');

/**
 * POST /orders/:orderId/return-requests
 * Initiate a return request for an order.
 */
async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user && req.user.id;
    const payload = req.body;
    const returnRequest = await returnsService.createReturnRequest({ orderId, userId, payload });
    return res.status(201).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests
 * List all return requests (admin).
 */
async function listReturnRequests(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      orderId: req.query.orderId,
      userId: req.query.userId,
      page: req.query.page ? parseInt(req.query.page, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit, 10) : 20,
    };
    const result = await returnsService.listReturnRequests(filters);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests/:returnRequestId
 * Get a single return request by ID.
 */
async function getReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const returnRequest = await returnsService.getReturnRequestById(returnRequestId);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found.' });
    }
    return res.status(200).json({ data: returnRequest });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /return-requests/:returnRequestId/review
 * Admin reviews (approves or rejects) a return request.
 */
async function reviewReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const adminId = req.user && req.user.id;
    const payload = req.body;
    const updatedRequest = await returnsService.reviewReturnRequest({ returnRequestId, adminId, payload });
    return res.status(200).json({ data: updatedRequest });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReturnRequest,
  listReturnRequests,
  getReturnRequest,
  reviewReturnRequest,
};
