import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Linkedin, Building2, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  title: string;
  company_name: string;
  linkedin: string;
  status: string;
  activities: any[];
  deals: any[];
}

function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contacts/${id}`)
      .then(res => res.json())
      .then(data => {
        setContact(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 dark:text-white">Loading...</div>;
  }

  if (!contact) {
    return <div className="text-center py-12 dark:text-white">Contact not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/contacts')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Contacts
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {contact.first_name} {contact.last_name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{contact.title}</p>
            {contact.company_name && (
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                <Building2 className="w-4 h-4 mr-2" />
                {contact.company_name}
              </div>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            contact.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {contact.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {contact.email && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Mail className="w-5 h-5 mr-3 text-gray-400" />
              <a href={`mailto:${contact.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                {contact.email}
              </a>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Phone className="w-5 h-5 mr-3 text-gray-400" />
              <a href={`tel:${contact.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                {contact.phone}
              </a>
            </div>
          )}
          {contact.linkedin && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Linkedin className="w-5 h-5 mr-3 text-gray-400" />
              <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
                LinkedIn Profile
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Deals ({contact.deals?.length || 0})
          </h2>
          {contact.deals && contact.deals.length > 0 ? (
            <div className="space-y-3">
              {contact.deals.map((deal: any) => (
                <div key={deal.id} className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{deal.title}</h3>
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      ${deal.value?.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{deal.stage}</span>
                    <span className="text-gray-500 dark:text-gray-500">{deal.probability}% probability</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No deals associated with this contact</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Activities ({contact.activities?.length || 0})
          </h2>
          {contact.activities && contact.activities.length > 0 ? (
            <div className="space-y-3">
              {contact.activities.slice(0, 10).map((activity: any) => (
                <div key={activity.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{activity.subject}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.type}
                    </span>
                  </div>
                  {activity.due_date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {format(new Date(activity.due_date), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No activities recorded</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactDetail;
