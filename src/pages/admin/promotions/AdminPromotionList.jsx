import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminPromotionList() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPromoCodes() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('/promo-codes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch promo codes');
        const data = await res.json();
        setPromoCodes(data.promoCodes || data.data || data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPromoCodes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
        <Link
          to="/admin/promotions/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <img src="/src/assets/icons/plus.svg" alt="" className="w-4 h-4" />
          New Promo Code
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {!loading && !error && promoCodes.length === 0 && (
        <div className="text-center py-12">
          <img src="/src/assets/images/empty-state.svg" alt="No promo codes" className="mx-auto h-24 w-24 mb-4" />
          <p className="text-gray-500">No promo codes found.</p>
          <Link
            to="/admin/promotions/new"
            className="mt-4 inline-block text-indigo-600 hover:underline text-sm"
          >
            Create your first promo code
          </Link>
        </div>
      )}

      {!loading && !error && promoCodes.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                    {promo.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {promo.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {promo.type === 'percentage'
                      ? `${promo.discount}%`
                      : `₹${Number(promo.discount).toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {promo.expiry_date
                      ? new Date(promo.expiry_date).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        promo.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      to={`/admin/promotions/${promo.id}/edit`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                    >
                      <img src="/src/assets/icons/edit.svg" alt="" className="w-4 h-4" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
