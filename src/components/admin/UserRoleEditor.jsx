import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserRoleEditor = ({ userId, currentRole, availableRoles, onRoleChange, loading }) => {
  const [selectedRole, setSelectedRole] = useState(currentRole || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setSelectedRole(currentRole || '');
  }, [currentRole]);

  const handleSave = async () => {
    if (!selectedRole) {
      setError('Please select a role.');
      return;
    }
    if (selectedRole === currentRole) {
      setError('The selected role is already assigned.');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await onRoleChange(userId, selectedRole);
      setSuccess('Role updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update role.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`role-select-${userId}`}
        className="text-sm font-medium text-gray-700"
      >
        Assign Role
      </label>
      <div className="flex items-center gap-3">
        <select
          id={`role-select-${userId}`}
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setError('');
            setSuccess('');
          }}
          disabled={loading}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select role…</option>
          {availableRoles.map((role) => (
            <option key={role.id || role} value={role.name || role}>
              {role.name || role}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && <p className="text-xs text-green-600">{success}</p>}
    </div>
  );
};

UserRoleEditor.propTypes = {
  userId: PropTypes.string.isRequired,
  currentRole: PropTypes.string,
  availableRoles: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    ])
  ),
  onRoleChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

UserRoleEditor.defaultProps = {
  currentRole: '',
  availableRoles: [],
  loading: false,
};

export default UserRoleEditor;
