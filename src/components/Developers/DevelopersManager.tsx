import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, FileText, ExternalLink } from 'lucide-react';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import { Developer } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { exportToCSV, downloadTemplate } from '../../utils/exportUtils';
import { PendingAction } from '../../types';

const createPendingAction = (type: 'create' | 'update' | 'delete', module: string, data: any, originalData?: any, user?: any) => {
  const pendingActions = JSON.parse(localStorage.getItem('pendingActions') || '[]');
  const newAction: PendingAction = {
    id: Date.now().toString(),
    type,
    module,
    data,
    originalData,
    requestedBy: user?.id || '',
    requestedByName: user?.name || '',
    requestedAt: new Date().toISOString(),
    status: 'pending'
  };
  pendingActions.push(newAction);
  localStorage.setItem('pendingActions', JSON.stringify(pendingActions));
};

const DevelopersManager: React.FC = () => {
  const { user } = useAuth();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [activeTab, setActiveTab] = useState<'corporate' | 'coworking' | 'warehouse' | 'malls'>('corporate');

  const [formData, setFormData] = useState({
    type: 'corporate' as Developer['type'],
    developerName: '',
    grade: 'A' as Developer['grade'],
    commonContact: '',
    emailId: '',
    websiteLink: '',
    linkedInLink: '',
    hoCity: '',
    presenceCity: '',
    noOfBuildings: '',
    noOfCoworking: '',
    noOfWarehouses: '',
    noOfMalls: ''
  });

  useEffect(() => {
    loadDevelopers();
  }, []);

  const loadDevelopers = () => {
    const storedDevelopers: Developer[] = JSON.parse(localStorage.getItem('developers') || '[]');
    setDevelopers(storedDevelopers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allDevelopers: Developer[] = JSON.parse(localStorage.getItem('developers') || '[]');

    const developerData = {
      ...formData,
      presenceCity: formData.presenceCity.split(',').map(city => city.trim()),
      noOfBuildings: formData.noOfBuildings ? parseInt(formData.noOfBuildings) : undefined,
      noOfCoworking: formData.noOfCoworking ? parseInt(formData.noOfCoworking) : undefined,
      noOfWarehouses: formData.noOfWarehouses ? parseInt(formData.noOfWarehouses) : undefined,
      noOfMalls: formData.noOfMalls ? parseInt(formData.noOfMalls) : undefined
    };

    if (user?.role === 'employee') {
      // Create pending action for employee
      if (editingDeveloper) {
        createPendingAction('update', 'developers', { ...editingDeveloper, ...developerData }, editingDeveloper, user);
      } else {
        const newDeveloper: Developer = {
          id: Date.now().toString(),
          ...developerData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        createPendingAction('create', 'developers', newDeveloper, undefined, user);
      }
      alert('Your request has been sent to admin for approval.');
    } else {
      // Admin can directly modify
      if (editingDeveloper) {
        const updatedDevelopers = allDevelopers.map(dev =>
          dev.id === editingDeveloper.id ? { ...dev, ...developerData } : dev
        );
        localStorage.setItem('developers', JSON.stringify(updatedDevelopers));
      } else {
        const newDeveloper: Developer = {
          id: Date.now().toString(),
          ...developerData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        allDevelopers.push(newDeveloper);
        localStorage.setItem('developers', JSON.stringify(allDevelopers));
      }
    }

    loadDevelopers();
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (developer: Developer) => {
    setEditingDeveloper(developer);
    setFormData({
      type: developer.type,
      developerName: developer.developerName,
      grade: developer.grade,
      commonContact: developer.commonContact,
      emailId: developer.emailId,
      websiteLink: developer.websiteLink,
      linkedInLink: developer.linkedInLink,
      hoCity: developer.hoCity,
      presenceCity: developer.presenceCity.join(', '),
      noOfBuildings: developer.noOfBuildings?.toString() || '',
      noOfCoworking: developer.noOfCoworking?.toString() || '',
      noOfWarehouses: developer.noOfWarehouses?.toString() || '',
      noOfMalls: developer.noOfMalls?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = (developer: Developer) => {
    if (user?.role === 'employee') {
      if (window.confirm('Your delete request will be sent to admin for approval. Continue?')) {
        createPendingAction('delete', 'developers', developer, undefined, user);
        alert('Delete request sent to admin for approval.');
      }
    } else {
      if (window.confirm('Are you sure you want to delete this developer?')) {
        const allDevelopers: Developer[] = JSON.parse(localStorage.getItem('developers') || '[]');
        const updatedDevelopers = allDevelopers.filter(d => d.id !== developer.id);
        localStorage.setItem('developers', JSON.stringify(updatedDevelopers));
        loadDevelopers();
      }
    }
  };

  const handleViewDetails = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'corporate',
      developerName: '',
      grade: 'A',
      commonContact: '',
      emailId: '',
      websiteLink: '',
      linkedInLink: '',
      hoCity: '',
      presenceCity: '',
      noOfBuildings: '',
      noOfCoworking: '',
      noOfWarehouses: '',
      noOfMalls: ''
    });
    setEditingDeveloper(null);
  };

  const handleExport = () => {
    const filteredDevelopers = developers.filter(dev => dev.type === activeTab);
    exportToCSV(filteredDevelopers, `${activeTab}_developers`);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          const importedDevelopers = lines.slice(1)
            .filter(line => line.trim())
            .map(line => {
              const values = line.split(',');
              const developer: Partial<Developer> = {};
              headers.forEach((header, index) => {
                const key = header.trim() as keyof Developer;
                if (key === 'presenceCity') {
                  developer[key] = values[index]?.split(';').map(city => city.trim()) || [];
                } else if (key.includes('noOf')) {
                  (developer as any)[key] = parseInt(values[index]) || 0;
                } else {
                  (developer as any)[key] = values[index]?.trim();
                }
              });
              return {
                ...developer,
                id: Date.now().toString() + Math.random(),
                type: activeTab,
                createdAt: new Date().toISOString().split('T')[0]
              } as Developer;
            });

          const allDevelopers: Developer[] = JSON.parse(localStorage.getItem('developers') || '[]');
          const updatedDevelopers = [...allDevelopers, ...importedDevelopers];
          localStorage.setItem('developers', JSON.stringify(updatedDevelopers));
          loadDevelopers();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const filteredDevelopers = developers.filter(dev => dev.type === activeTab);

  const getColumns = () => {
    const baseColumns = [
      { key: 'developerName', label: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Developer Name`, sortable: true },
      { 
        key: 'grade', 
        label: 'Grade', 
        sortable: true,
        render: (value: string) => (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'A' ? 'bg-green-100 text-green-800' :
            value === 'B' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            Grade {value}
          </span>
        )
      },
      { key: 'commonContact', label: 'Common Contact', sortable: true },
      { key: 'emailId', label: 'Email ID', sortable: true },
      { key: 'websiteLink', label: 'Website Link', sortable: true },
      { key: 'hoCity', label: 'HO City', sortable: true }
    ];

    // Add type-specific columns for view
    if (activeTab === 'corporate') {
      baseColumns.push({ key: 'noOfBuildings', label: 'No. of Buildings', sortable: true });
    } else if (activeTab === 'coworking') {
      baseColumns.push({ key: 'noOfCoworking', label: 'No. of Coworking', sortable: true });
    } else if (activeTab === 'warehouse') {
      baseColumns.push({ key: 'noOfWarehouses', label: 'No. of Warehouses', sortable: true });
    } else if (activeTab === 'malls') {
      baseColumns.push({ key: 'noOfMalls', label: 'No. of Malls', sortable: true });
    }

    return baseColumns;
  };

  const actions = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: handleViewDetails,
      variant: 'secondary' as const
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: handleEdit,
      variant: 'primary' as const
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'danger' as const
    }
  ];

  const filteredActions = user?.role === 'admin' ? actions : actions.filter(action => action.label === 'View Details');

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'corporate': return 'Corporate Developer';
      case 'coworking': return 'Coworking Developer';
      case 'warehouse': return 'Warehouse Developer';
      case 'malls': return 'Mall Developer';
      default: return type;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Developer List</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage developers across different categories</p>
        </div>
        {user?.role === 'admin' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => downloadTemplate('developers')}
              className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>Template</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setFormData({ ...formData, type: activeTab });
                setShowModal(true);
              }}
              className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add {getTabLabel(activeTab)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max">
          {[
            { id: 'corporate', label: 'Corporate Developer' },
            { id: 'coworking', label: 'Coworking Developer' },
            { id: 'warehouse', label: 'Warehouse Developer' },
            { id: 'malls', label: 'Mall Developer' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="overflow-hidden">
        <DataTable
          data={filteredDevelopers}
          columns={getColumns()}
          actions={filteredActions}
          searchable={true}
          exportable={true}
          importable={user?.role === 'admin'}
          onExport={handleExport}
          onImport={handleImport}
          title={`${getTabLabel(activeTab)} List`}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingDeveloper ? `Edit ${getTabLabel(activeTab)}` : `Add ${getTabLabel(activeTab)}`}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTabLabel(activeTab)} Name *
              </label>
              <input
                type="text"
                value={formData.developerName}
                onChange={(e) => setFormData({ ...formData, developerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade *
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value as Developer['grade'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Common Contact *
              </label>
              <input
                type="text"
                value={formData.commonContact}
                onChange={(e) => setFormData({ ...formData, commonContact: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID *
              </label>
              <input
                type="email"
                value={formData.emailId}
                onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Online Presence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website Link
              </label>
              <input
                type="url"
                value={formData.websiteLink}
                onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Link
              </label>
              <input
                type="url"
                value={formData.linkedInLink}
                onChange={(e) => setFormData({ ...formData, linkedInLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="https://linkedin.com/company/example"
              />
            </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Location Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HO City *
              </label>
              <input
                type="text"
                value={formData.hoCity}
                onChange={(e) => setFormData({ ...formData, hoCity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presence City *
              </label>
              <input
                type="text"
                value={formData.presenceCity}
                onChange={(e) => setFormData({ ...formData, presenceCity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Mumbai, Delhi, Bangalore (comma separated)"
                required
              />
            </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
            >
              {editingDeveloper ? `Update ${getTabLabel(activeTab)}` : `Create ${getTabLabel(activeTab)}`} {user?.role === 'employee' && '(Pending Approval)'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`${getTabLabel(activeTab)} Details`}
        size="xl"
      >
        {selectedDeveloper && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">{getTabLabel(activeTab)} Name</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.developerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Grade</label>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  selectedDeveloper.grade === 'A' ? 'bg-green-100 text-green-800' :
                  selectedDeveloper.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Grade {selectedDeveloper.grade}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Common Contact Contact</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.commonContact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email ID</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.emailId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Website Link</label>
                {selectedDeveloper.websiteLink ? (
                  <a href={selectedDeveloper.websiteLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    {selectedDeveloper.websiteLink} <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Not provided</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">LinkedIn Link</label>
                {selectedDeveloper.linkedInLink ? (
                  <a href={selectedDeveloper.linkedInLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    LinkedIn Profile <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Not provided</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">HO City</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.hoCity}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Presence City</label>
              <div className="flex flex-wrap gap-2">
                {selectedDeveloper.presenceCity.map((city, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {city}
                  </span>
                ))}
              </div>
            </div>
            {selectedDeveloper.type === 'corporate' && selectedDeveloper.noOfBuildings && (
              <div>
                <label className="block text-sm font-medium text-gray-500">No. of Buildings</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.noOfBuildings}</p>
              </div>
            )}
            {selectedDeveloper.type === 'coworking' && selectedDeveloper.noOfCoworking && (
              <div>
                <label className="block text-sm font-medium text-gray-500">No. of Coworking</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.noOfCoworking}</p>
              </div>
            )}
            {selectedDeveloper.type === 'warehouse' && selectedDeveloper.noOfWarehouse && (
              <div>
                <label className="block text-sm font-medium text-gray-500">No. of Warehouses</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.noOfWarehouses}</p>
              </div>
            )}
            {selectedDeveloper.type === 'malls' && selectedDeveloper.noOfMalls && (
              <div>
                <label className="block text-sm font-medium text-gray-500">No. of Malls</label>
                <p className="text-sm text-gray-900">{selectedDeveloper.noOfMalls}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DevelopersManager;
