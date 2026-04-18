import React, { useEffect, useState } from 'react';
import { Building2, Users, DollarSign, Globe, Phone, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { apiUrl } from '../config';
import { useToast } from '../contexts/ToastContext';
import CompanyModal from '../components/CompanyModal';
import ConfirmDialog from '../components/ConfirmDialog';

interface Company {
  id: number;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  employees: number;
  revenue: number;
  contact_count: number;
  deal_count: number;
}

function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(apiUrl('/api/companies'));
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      showToast('error', 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCompany(undefined);
    setShowModal(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleSave = () => {
    loadData();
    showToast('success', selectedCompany ? 'Company updated successfully' : 'Company created successfully');
  };

  const handleDelete = async () => {
    if (!deleteCompany) return;
    try {
      await fetch(apiUrl(`/api/companies/${deleteCompany.id}`), { method: 'DELETE' });
      loadData();
      showToast('success', 'Company deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete company');
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Companies</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Track organizations and accounts</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Company
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-lg p-3">
                    <Building2 className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-500">{company.industry}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {company.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    {company.website}
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {company.phone}
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {company.email}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  📍 {company.city}, {company.state}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{company.contact_count}</div>
                    <div className="text-xs text-gray-500">Contacts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{company.deal_count}</div>
                    <div className="text-xs text-gray-500">Deals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{company.employees}</div>
                    <div className="text-xs text-gray-500">Employees</div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(company)}
                    className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCompany(company)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredCompanies.length} of {companies.length} companies
      </div>

      <CompanyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        company={selectedCompany}
      />

      <ConfirmDialog
        isOpen={deleteCompany !== null}
        onClose={() => setDeleteCompany(null)}
        onConfirm={handleDelete}
        title="Delete Company"
        message={`Are you sure you want to delete ${deleteCompany?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}

export default Companies;
