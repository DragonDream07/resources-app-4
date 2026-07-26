import api from './api.js';

// Domain service delegates
export { adminListUsers, adminGetUser, adminUpdateUser, adminDeleteUser } from './usersService.js';
export {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImages,
  adminCreateProductSku,
  adminUpdateProductSku,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateBrand,
} from './catalogueService.js';
export { adminListOrders, adminGetOrder, adminAdvanceOrder } from './ordersService.js';
export {
  adminListReturnRequests,
  adminReviewReturnRequest,
} from './returnsService.js';
export {
  adminListPromoCodes,
  adminCreatePromoCode,
  adminUpdatePromoCode,
  adminDeletePromoCode,
} from './promotionsService.js';

// ---------------------------------------------------------------------------
// Admin dashboard stats
// ---------------------------------------------------------------------------

/**
 * GET /admin/stats — dashboard summary statistics
 */
export const getDashboardStats = () =>
  api.get('/admin/stats').then((res) => res.data);

/**
 * GET /admin/reports — admin reports
 */
export const getReports = (params) =>
  api.get('/admin/reports', { params }).then((res) => res.data);
