import React, { useState, useEffect } from 'react';
import { Users, Building2, TrendingUp, UserPlus, Key, Trash2, Power } from 'lucide-react';
import { apiUrl } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Organization {
  id: string;
  name: string;
  subdomain: string;
  plan: string;
  user_count: number;
  contact_count: number;
  company_count: number;
  deal_count: number;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  organization_name: string;
  plan: string;
  last_login: string;
  created_at: string;
}

interface Stats {
  total_organizations: number;
  total_users: number;
  total_contacts: number;
  total_companies: number;
  total_deals: number;
  active_users_7d: number;
  active_users_30d: number;
}

function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users' | 'create'>('overview');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { showToast } = useToast();

  const [newOrg, setNewOrg] = useState({
    organizationName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    plan: 'professional'
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await fetch(apiUrl('/api/admin/stats'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } else if (activeTab === 'organizations') {
        const res = await fetch(apiUrl('/api/admin/organizations'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setOrganizations(data);
      } else if (activeTab === 'users') {
        const res = await fetch(apiUrl('/api/admin/users'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      showToast('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl('/api/admin/organizations'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newOrg)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create organization');
      }

      showToast('success', 'Organization created successfully');
      setNewOrg({
        organizationName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        plan: 'professional'
      });
      setActiveTab('organizations');
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await fetch(apiUrl(`/api/admin/users/${userId}/reset-password`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      showToast('success', 'Password reset successfully');
    } catch (error) {
      showToast('error', 'Failed to reset password');
    }
  };

  const handleToggleUser = async (userId: string) => {
    try {
      await fetch(apiUrl(`/api/admin/users/${userId}/toggle-active`), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      showToast('success', 'User status updated');
      loadData();
    } catch (error) {
      showToast('error', 'Failed to update user');
    }
  };

  const handleDeleteOrg = async (orgId: string, orgName: string) => {
    if (!window.confirm(`Delete ${orgName} and ALL associated data? This cannot be undone.`)) {
      return;
    }

    try {
      await fetch(apiUrl(`/api/admin/organizations/${orgId}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      showToast('success', 'Organization deleted');
      loadData();
    } catch (error) {
      showToast('error', 'Failed to delete organization');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Manage organizations and users</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'organizations', label: 'Organizations', icon: Building2 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'create', label: 'Create Account', icon: UserPlus }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Organizations</p>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.total_organizations}</p>
                      </div>
                      <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Total Users</p>
                        <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.total_users}</p>
                      </div>
                      <Users className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">Active (7d)</p>
                        <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.active_users_7d}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 dark:text-orange-400">Total Contacts</p>
                        <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.total_contacts}</p>
                      </div>
                      <Users className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'organizations' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Users</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {organizations.map((org) => (
                        <tr key={org.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{org.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{org.subdomain}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {org.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{org.user_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {org.contact_count} contacts, {org.company_count} companies, {org.deal_count} deals
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(org.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteOrg(org.id, org.name)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.first_name} {user.last_name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.organization_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleResetPassword(user.id)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                                title="Reset Password"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleUser(user.id)}
                                className="text-orange-600 hover:text-orange-900 dark:text-orange-400"
                                title="Toggle Active"
                              >
                                <Power className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'create' && (
                <form onSubmit={handleCreateOrganization} className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={newOrg.organizationName}
                      onChange={(e) => setNewOrg({ ...newOrg, organizationName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Acme Corp"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={newOrg.firstName}
                        onChange={(e) => setNewOrg({ ...newOrg, firstName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={newOrg.lastName}
                        onChange={(e) => setNewOrg({ ...newOrg, lastName: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newOrg.email}
                      onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="text"
                      value={newOrg.password}
                      onChange={(e) => setNewOrg({ ...newOrg, password: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Min 6 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Plan
                    </label>
                    <select
                      value={newOrg.plan}
                      onChange={(e) => setNewOrg({ ...newOrg, plan: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Create Organization
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
