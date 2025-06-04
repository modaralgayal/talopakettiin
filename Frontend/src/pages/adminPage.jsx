import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleManageProvidersClick = () => {
    navigate('/admin/provider-management');
  };

  const handleManageUsersClick = () => {
    navigate('/admin/user-management');
  };

  const handleManageApplicationsClick = () => {
    navigate('/admin/application-management');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Provider Management Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Provider Management</h2>
              <p className="text-gray-600 mb-4">Manage verified providers and their domains.</p>
              <button
                onClick={handleManageProvidersClick}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Manage Providers →
              </button>
            </div>

            {/* User Management Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
              <p className="text-gray-600 mb-4">View and manage user accounts and permissions.</p>
              <button
                onClick={handleManageUsersClick}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Manage Users →
              </button>
            </div>

            {/* Application Management Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Management</h2>
              <p className="text-gray-600 mb-4">View and manage all applications and offers.</p>
              <button
                onClick={handleManageApplicationsClick}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Manage Applications →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 