import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const AdminManagement = () => {
  const { t } = useTranslation();
  const [adminUsers, setAdminUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('error');

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 5000);
  };

  const fetchAdminUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/admin/users`, {
        withCredentials: true
      });
      if (response.data.success) {
        setAdminUsers(response.data.admins);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      showMessage('Failed to fetch admin users', 'error');
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Management</h2>
      
      {/* Admin Users List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Admin Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminUsers.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            messageType === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminManagement; 