import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const INITIAL_FORM = {
  code: '',
  type: 'percentage',
  discount: '',
  min_order_amount: '',
  max_uses: '',
  expiry_date: '',
  is_active: true,
};

export default function AdminPromotionNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.code.trim()) errs.code = 'Code is required.';
    if (!form.type) errs.type = 'Type is required.';
    if (form.discount === '' || isNaN(Number(form.discount)) || Number(form.discount) <= 0) {
      errs.discount = 'Discount must be a positive number.';
    }
    if (form.type === 'percentage' && Number(form.discount) > 100) {
      errs.discount = 'Percentage discount cannot exceed 100.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        discount: Number(form.discount),
        is_active: form.is_active,
        ...(form.min_order_amount !== '' && { min_order_amount: Number(form.min_order_amount) }),
        ...(form.max_uses !== '' && { max_uses: Number(form.max_uses) }),
        ...(form.expiry_date !== '' && { expiry_date: form.expiry_date }),
      };
      const res = await fetch('/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create promo code');
      }
      navigate('/admin/promotions');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/promotions" className="text-gray-500 hover:text-gray-700 text-sm">
          ← Promo Codes
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Promo Code</h1>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-5">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Promo Code <span className="text-red-500">*</span>
          </label>
          <input
            id="code"
            name="code"
            type="text"
            value={form.code}
            onChange={handleChange}
            placeholder="e.g. SAVE20"
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase ${
              errors.code ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.type ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
            Discount {form.type === 'percentage' ? '(%)' : '(₹)'} <span className="text-red-500">*</span>
          </label>
          <input
            id="discount"
            name="discount"
            type="number"
            min="0"
            step="0.01"
            value={form.discount}
            onChange={handleChange}
            placeholder={form.type === 'percentage' ? '0 – 100' : 'Amount'}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.discount ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
        </div>

        <div>
          <label htmlFor="min_order_amount" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Order Amount (₹)
          </label>
          <input
            id="min_order_amount"
            name="min_order_amount"
            type="number"
            min="0"
            step="0.01"
            value={form.min_order_amount}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="max_uses" className="block text-sm font-medium text-gray-700 mb-1">
            Max Uses
          </label>
          <input
            id="max_uses"
            name="max_uses"
            type="number"
            min="1"
            step="1"
            value={form.max_uses}
            onChange={handleChange}
            placeholder="Optional — leave blank for unlimited"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            id="expiry_date"
            name="expiry_date"
            type="date"
            value={form.expiry_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Creating…' : 'Create Promo Code'}
          </button>
          <Link
            to="/admin/promotions"
            className="text-gray-600 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
