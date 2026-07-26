import * as Yup from 'yup';

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required.'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be at most 100 characters.')
    .required('Name is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required.'),
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters.')
    .required('New password is required.'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match.')
    .required('Please confirm your new password.'),
});

export const guestRegisterSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
});

// ---------------------------------------------------------------------------
// Address schema
// ---------------------------------------------------------------------------

export const addressSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be at most 100 characters.')
    .required('Name is required.'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')
    .required('Phone number is required.'),
  addressLine1: Yup.string()
    .min(5, 'Address must be at least 5 characters.')
    .max(255, 'Address must be at most 255 characters.')
    .required('Address line 1 is required.'),
  addressLine2: Yup.string()
    .max(255, 'Address line 2 must be at most 255 characters.')
    .nullable(),
  city: Yup.string()
    .max(100, 'City must be at most 100 characters.')
    .required('City is required.'),
  state: Yup.string()
    .max(100, 'State must be at most 100 characters.')
    .required('State is required.'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Please enter a valid 6-digit PIN code.')
    .required('PIN code is required.'),
  isDefault: Yup.boolean(),
});

// ---------------------------------------------------------------------------
// Profile schema
// ---------------------------------------------------------------------------

export const profileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be at most 100 characters.')
    .required('Name is required.'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')
    .nullable(),
});

// ---------------------------------------------------------------------------
// Promo code schema
// ---------------------------------------------------------------------------

export const promoCodeSchema = Yup.object({
  code: Yup.string()
    .trim()
    .uppercase()
    .min(3, 'Promo code must be at least 3 characters.')
    .max(30, 'Promo code must be at most 30 characters.')
    .required('Promo code is required.'),
});

// ---------------------------------------------------------------------------
// Return request schema
// ---------------------------------------------------------------------------

export const returnRequestSchema = Yup.object({
  reason: Yup.string()
    .min(10, 'Reason must be at least 10 characters.')
    .max(1000, 'Reason must be at most 1000 characters.')
    .required('Reason for return is required.'),
  items: Yup.array()
    .of(
      Yup.object({
        orderItemId: Yup.string().required('Order item ID is required.'),
        quantity: Yup.number()
          .integer('Quantity must be a whole number.')
          .min(1, 'Quantity must be at least 1.')
          .required('Quantity is required.'),
      })
    )
    .min(1, 'At least one item must be selected for return.')
    .required('Items are required.'),
});

// ---------------------------------------------------------------------------
// Admin: Product schema
// ---------------------------------------------------------------------------

export const adminProductSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters.')
    .max(255, 'Product name must be at most 255 characters.')
    .required('Product name is required.'),
  description: Yup.string()
    .max(5000, 'Description must be at most 5000 characters.')
    .nullable(),
  brandId: Yup.string()
    .required('Brand is required.'),
  categoryId: Yup.string()
    .required('Category is required.'),
  isActive: Yup.boolean(),
});

// ---------------------------------------------------------------------------
// Admin: Category schema
// ---------------------------------------------------------------------------

export const adminCategorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Category name must be at least 2 characters.')
    .max(100, 'Category name must be at most 100 characters.')
    .required('Category name is required.'),
  parentId: Yup.string()
    .nullable(),
  description: Yup.string()
    .max(1000, 'Description must be at most 1000 characters.')
    .nullable(),
});

// ---------------------------------------------------------------------------
// Admin: Brand schema
// ---------------------------------------------------------------------------

export const adminBrandSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Brand name must be at least 2 characters.')
    .max(100, 'Brand name must be at most 100 characters.')
    .required('Brand name is required.'),
  description: Yup.string()
    .max(1000, 'Description must be at most 1000 characters.')
    .nullable(),
});

// ---------------------------------------------------------------------------
// Admin: Promo code schema
// ---------------------------------------------------------------------------

export const adminPromoCodeSchema = Yup.object({
  code: Yup.string()
    .trim()
    .uppercase()
    .min(3, 'Promo code must be at least 3 characters.')
    .max(30, 'Promo code must be at most 30 characters.')
    .required('Promo code is required.'),
  discountType: Yup.string()
    .oneOf(['percentage', 'flat'], 'Discount type must be either percentage or flat.')
    .required('Discount type is required.'),
  discountValue: Yup.number()
    .positive('Discount value must be a positive number.')
    .required('Discount value is required.'),
  minOrderValue: Yup.number()
    .min(0, 'Minimum order value cannot be negative.')
    .nullable(),
  maxDiscount: Yup.number()
    .positive('Maximum discount must be a positive number.')
    .nullable(),
  expiresAt: Yup.string()
    .nullable(),
  usageLimit: Yup.number()
    .integer('Usage limit must be a whole number.')
    .positive('Usage limit must be a positive number.')
    .nullable(),
  isActive: Yup.boolean(),
});

export default {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  guestRegisterSchema,
  addressSchema,
  profileSchema,
  promoCodeSchema,
  returnRequestSchema,
  adminProductSchema,
  adminCategorySchema,
  adminBrandSchema,
  adminPromoCodeSchema,
};
