const promotionsService = require('./promotions.service');

const applyPromoCode = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { code } = req.body;
    const userId = req.user.id;
    const result = await promotionsService.applyPromoCode({ cartId, code, userId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const listPromoCodes = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await promotionsService.listPromoCodes(filters);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const createPromoCode = async (req, res, next) => {
  try {
    const payload = req.body;
    const result = await promotionsService.createPromoCode(payload);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getPromoCode = async (req, res, next) => {
  try {
    const { promoCodeId } = req.params;
    const result = await promotionsService.getPromoCodeById(promoCodeId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const updatePromoCode = async (req, res, next) => {
  try {
    const { promoCodeId } = req.params;
    const payload = req.body;
    const result = await promotionsService.updatePromoCode(promoCodeId, payload);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const deletePromoCode = async (req, res, next) => {
  try {
    const { promoCodeId } = req.params;
    await promotionsService.deletePromoCode(promoCodeId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  applyPromoCode,
  listPromoCodes,
  createPromoCode,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
};
