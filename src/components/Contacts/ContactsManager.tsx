import React, { useState, useEffect } from 'react';
import { ContactType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import { exportToCSV } from '../../utils/exportUtils';
import { Plus, Upload, Download, Users, Building2, User, UserCheck } from 'lucide-react';

// Replace the existing Contact interface usage with proper typing
export interface Contact {
  id: string;
  type: ContactType;
  companyName?: string;
  developerName?: string;
  individualOwnerName?: string;
  industry?: string;
  contactType?: string;
  ownerType?: string;
  contactPerson: string;
  designation?: string;
  departmentDesignation?: string;
  contactNo: string;
  alternateNo?: string;
  emailId: string;
  linkedinLink?: string;
  city: string;
  location: string;
}

const ContactsManager: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<ContactType>('Client');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Initialize with sample data
      const sampleContacts: Contact[] = [
        {
          id: '1',
          type: 'Client',
          companyName: 'Tech Solutions Ltd',
          industry: 'Technology',
          contactPerson: 'John Smith',
          designation: 'CEO',
          contactNo: '+91 9876543210',
          alternateNo: '+91 9876543211',
          emailId: 'john@techsolutions.com',
          linkedinLink: 'https://linkedin.com/in/johnsmith',
          city: 'Mumbai',
          location: 'Bandra Kurla Complex'
        },
        {
          id: '2',
          type: 'Developer',
          developerName: 'DLF Limited',
          contactType: 'Corporate',
          contactPerson: 'Sarah Johnson',
          designation: 'Project Manager',
          contactNo: '+91 9876543212',
          alternateNo: '+91 9876543213',
          emailId: 'sarah@dlf.com',
          linkedinLink: 'https://linkedin.com/in/sarahjohnson',
          city: 'Delhi',
          location: 'Cyber City'
        }
      ];
      setContacts(sampleContacts);
      localStorage.setItem('contacts', JSON.stringify(sampleContacts));
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.type === activeTab &&
    (contact.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.developerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.individualOwnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.emailId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Update the handleSubmit function to properly handle form data
  const handleSubmit = (formData: FormData) => {
    const data = new FormData(formData.target as HTMLFormElement);
    const contactData: Partial<Contact> = {
      type: activeTab,
    };

    // Extract form data
    for (const [key, value] of data.entries()) {
      (contactData as any)[key] = value;
    }

    const finalContactData: Contact = {
      id: editingContact?.id || Date.now().toString(),
      ...contactData,
    } as Contact;

    if (editingContact) {
      setContacts(contacts.map(contact => 
        contact.id === editingContact.id ? finalContactData : contact
      ));
    } else {
      setContacts([...contacts, finalContactData]);
    }

    localStorage.setItem('contacts', JSON.stringify(
      editingContact 
        ? contacts.map(contact => contact.id === editingContact.id ? finalContactData : contact)
        : [...contacts, finalContactData]
    ));

    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setActiveTab(contact.type);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    }
  };

  const handleExport = () => {
    exportToCSV(filteredContacts, `${activeTab.toLowerCase()}-contacts`);
  };

  const getTabIcon = (type: ContactType) => {
    switch (type) {
      case 'Client': return <Building2 className="w-4 h-4" />;
      case 'Developer': return <Users className="w-4 h-4" />;
      case 'Individual Owner': return <User className="w-4 h-4" />;
      case 'Others': return <UserCheck className="w-4 h-4" />;
    }
  };

  const getColumns = () => {
    const baseColumns = [
      { key: 'contactPerson', label: 'Contact Person' },
      { key: 'designation', label: 'Designation' },
      { key: 'contactNo', label: 'Contact No.' },
      { key: 'emailId', label: 'Email ID' },
      { key: 'city', label: 'City' },
      { key: 'location', label: 'Location' }
    ];

    switch (activeTab) {
      case 'Client':
        return [
          { key: 'companyName', label: 'Company Name' },
          { key: 'industry', label: 'Industry' },
          ...baseColumns
        ];
      case 'Developer':
        return [
          { key: 'developerName', label: 'Developer Name' },
          { key: 'contactType', label: 'Type' },
          ...baseColumns
        ];
      case 'Individual Owner':
        return [
          { key: 'individualOwnerName', label: 'Individual Owner Name' },
          { key: 'ownerType', label: 'Type' },
          { key: 'contactPerson', label: 'Contact Person' },
          { key: 'departmentDesignation', label: 'Department / Designation' },
          { key: 'contactNo', label: 'Contact No.' },
          { key: 'alternateNo', label: 'Alternate No.' },
          { key: 'emailId', label: 'Email ID' },
          { key: 'linkedinLink', label: 'LinkedIn Link' },
          { key: 'city', label: 'City' },
          { key: 'location', label: 'Location' }
        ];
      default:
        return [
          { key: 'companyName', label: 'Company/Name' },
          { key: 'industry', label: 'Type' },
          ...baseColumns
        ];
    }
  };

  const renderForm = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person *
            </label>
            <input
              type="text"
              name="contactPerson"
              defaultValue={editingContact?.contactPerson || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {activeTab === 'Individual Owner' ? 'Department / Designation' : 'Designation'}
            </label>
            <input
              type="text"
              name={activeTab === 'Individual Owner' ? 'departmentDesignation' : 'designation'}
              defaultValue={editingContact?.designation || editingContact?.departmentDesignation || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact No. *
            </label>
            <input
              type="tel"
              name="contactNo"
              defaultValue={editingContact?.contactNo || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternate No.
            </label>
            <input
              type="tel"
              name="alternateNo"
              defaultValue={editingContact?.alternateNo || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ID *
            </label>
            <input
              type="email"
              name="emailId"
              defaultValue={editingContact?.emailId || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Link
            </label>
            <input
              type="url"
              name="linkedinLink"
              defaultValue={editingContact?.linkedinLink || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              defaultValue={editingContact?.city || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              defaultValue={editingContact?.location || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </>
    );

    switch (activeTab) {
      case 'Client':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  defaultValue={editingContact?.companyName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  defaultValue={editingContact?.industry || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {commonFields}
          </>
        );

      case 'Developer':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Developer Name *
                </label>
                <input
                  type="text"
                  name="developerName"
                  defaultValue={editingContact?.developerName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="contactType"
                  defaultValue={editingContact?.contactType || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Individual">Individual</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
            </div>
            {commonFields}
          </>
        );

      case 'Individual Owner':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Individual Owner Name *
                </label>
                <input
                  type="text"
                  name="individualOwnerName"
                  defaultValue={editingContact?.individualOwnerName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  name="ownerType"
                  defaultValue={editingContact?.ownerType || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {commonFields}
          </>
        );

      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  defaultValue={editingContact?.companyName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  name="industry"
                  defaultValue={editingContact?.industry || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {commonFields}
          </>
        );
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Contact List</h1>
        <p className="text-gray-600">Manage your business contacts across different categories</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {(['Client', 'Developer', 'Individual Owner', 'Others'] as ContactType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === type
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getTabIcon(type)}
                <span>{type}</span>
                <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {contacts.filter(c => c.type === type).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
        </div>

        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredContacts}
        columns={getColumns()}
        onEdit={handleEdit}
        onDelete={user?.role === 'admin' ? handleDelete : undefined}
      />

      {/* Modal */}
<Modal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingContact(null);
  }}
  title={`${editingContact ? 'Edit' : 'Add'} ${activeTab}`}
>
  <form onSubmit={(e) => {
    e.preventDefault();
    handleSubmit(e);
  }} className="space-y-4">
    {renderForm()}
    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {editingContact ? 'Update Contact' : 'Create Contact'}
      </button>
    </div>
  </form>
</Modal>

    </div>
  );
};



export default ContactsManager;
