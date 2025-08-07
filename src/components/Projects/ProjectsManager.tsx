import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, FileText, Building, Users, Package, ShoppingBag } from 'lucide-react';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import { ProjectMaster } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { exportToCSV, downloadTemplate } from '../../utils/exportUtils';

const ProjectsManager: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectMaster[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectMaster | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectMaster | null>(null);
  const [activeTab, setActiveTab] = useState<'corporate_building' | 'coworking_space' | 'warehouse' | 'retail_mall'>('corporate_building');

  const [formData, setFormData] = useState({
    type: 'corporate_building' as ProjectMaster['type'],
    name: '',
    grade: 'A' as ProjectMaster['grade'],
    developerOwner: '',
    contactNo: '',
    alternateNo: '',
    email: '',
    city: '',
    location: '',
    googleLocation: '',
    noOfFloors: '',
    floorPlate: '',
    noOfSeats: '',
    availabilityOfSeats: '',
    perOpenDeskCost: '',
    perDedicatedDeskCost: '',
    setupFees: '',
    noOfWarehouses: '',
    warehouseSize: '',
    totalArea: '',
    efficiency: '',
    floorPlateArea: '',
    rentPerSqft: '',
    camPerSqft: '',
    amenities: '',
    remark: '',
    status: 'Active' as ProjectMaster['status']
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const storedProjects: ProjectMaster[] = JSON.parse(localStorage.getItem('projects') || '[]');
    setProjects(storedProjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allProjects: ProjectMaster[] = JSON.parse(localStorage.getItem('projects') || '[]');

    const projectData = {
      ...formData,
      noOfFloors: formData.noOfFloors ? parseInt(formData.noOfFloors) : undefined,
      noOfSeats: formData.noOfSeats ? parseInt(formData.noOfSeats) : undefined,
      availabilityOfSeats: formData.availabilityOfSeats ? parseInt(formData.availabilityOfSeats) : undefined,
      perOpenDeskCost: formData.perOpenDeskCost ? parseFloat(formData.perOpenDeskCost) : undefined,
      perDedicatedDeskCost: formData.perDedicatedDeskCost ? parseFloat(formData.perDedicatedDeskCost) : undefined,
      setupFees: formData.setupFees ? parseFloat(formData.setupFees) : undefined,
      noOfWarehouses: formData.noOfWarehouses ? parseInt(formData.noOfWarehouses) : undefined,
      rentPerSqft: parseFloat(formData.rentPerSqft) || 0,
      camPerSqft: parseFloat(formData.camPerSqft) || 0
    };

    if (editingProject) {
      const updatedProjects = allProjects.map(project =>
        project.id === editingProject.id
          ? { ...project, ...projectData }
          : project
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    } else {
      const newProject: ProjectMaster = {
        id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      allProjects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(allProjects));
    }

    loadProjects();
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (project: ProjectMaster) => {
    setEditingProject(project);
    setFormData({
      type: project.type,
      name: project.name,
      grade: project.grade,
      developerOwner: project.developerOwner,
      contactNo: project.contactNo,
      alternateNo: project.alternateNo,
      email: project.email,
      city: project.city,
      location: project.location,
      googleLocation: project.googleLocation,
      noOfFloors: project.noOfFloors?.toString() || '',
      floorPlate: project.floorPlate || '',
      noOfSeats: project.noOfSeats?.toString() || '',
      availabilityOfSeats: project.availabilityOfSeats?.toString() || '',
      perOpenDeskCost: project.perOpenDeskCost?.toString() || '',
      perDedicatedDeskCost: project.perDedicatedDeskCost?.toString() || '',
      setupFees: project.setupFees?.toString() || '',
      noOfWarehouses: project.noOfWarehouses?.toString() || '',
      warehouseSize: project.warehouseSize || '',
      totalArea: project.totalArea || '',
      efficiency: project.efficiency || '',
      floorPlateArea: project.floorPlateArea || '',
      rentPerSqft: project.rentPerSqft.toString(),
      camPerSqft: project.camPerSqft.toString(),
      amenities: project.amenities,
      remark: project.remark,
      status: project.status
    });
    setShowModal(true);
  };

  const handleDelete = (project: ProjectMaster) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const allProjects: ProjectMaster[] = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = allProjects.filter(p => p.id !== project.id);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      loadProjects();
    }
  };

  const handleViewDetails = (project: ProjectMaster) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: activeTab,
      name: '',
      grade: 'A',
      developerOwner: '',
      contactNo: '',
      alternateNo: '',
      email: '',
      city: '',
      location: '',
      googleLocation: '',
      noOfFloors: '',
      floorPlate: '',
      noOfSeats: '',
      availabilityOfSeats: '',
      perOpenDeskCost: '',
      perDedicatedDeskCost: '',
      setupFees: '',
      noOfWarehouses: '',
      warehouseSize: '',
      totalArea: '',
      efficiency: '',
      floorPlateArea: '',
      rentPerSqft: '',
      camPerSqft: '',
      amenities: '',
      remark: '',
      status: 'Active'
    });
    setEditingProject(null);
  };

  const handleExport = () => {
    const filteredProjects = projects.filter(project => project.type === activeTab);
    exportToCSV(filteredProjects, `${activeTab}_projects`);
  };

  const filteredProjects = projects.filter(project => project.type === activeTab);

  const getColumns = () => {
    const baseColumns = [
      { key: 'name', label: 'Name', sortable: true },
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
      { key: 'developerOwner', label: 'Developer / Owner', sortable: true },
      { key: 'contactNo', label: 'Contact No.', sortable: true },
      { key: 'city', label: 'City', sortable: true },
      { key: 'location', label: 'Location', sortable: true }
    ];

    // Add type-specific columns
    if (activeTab === 'corporate_building') {
      baseColumns.push(
        { key: 'noOfFloors', label: 'No. of Floors', sortable: true },
        { key: 'floorPlate', label: 'Floor Plate', sortable: true }
      );
    } else if (activeTab === 'coworking_space') {
      baseColumns.push(
        { key: 'noOfSeats', label: 'No. of Seats', sortable: true },
        { key: 'availabilityOfSeats', label: 'Availability of Seats', sortable: true }
      );
    } else if (activeTab === 'warehouse') {
      baseColumns.push(
        { key: 'noOfWarehouses', label: 'No. of Warehouses', sortable: true },
        { key: 'warehouseSize', label: 'Warehouse Size', sortable: true }
      );
    } else if (activeTab === 'retail_mall') {
      baseColumns.push(
        { key: 'totalArea', label: 'Total Area', sortable: true },
        { key: 'efficiency', label: 'Efficiency', sortable: true }
      );
    }

    baseColumns.push(
      { 
        key: 'status', 
        label: 'Status', 
        sortable: true,
        render: (value: string) => (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'Active' ? 'bg-green-100 text-green-800' :
            value === 'Inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {value}
          </span>
        )
      }
    );

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
      case 'corporate_building': return 'Corporate Building';
      case 'coworking_space': return 'Coworking Space';
      case 'warehouse': return 'Warehouse';
      case 'retail_mall': return 'Retail / Mall';
      default: return type;
    }
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'corporate_building': return <Building className="w-4 h-4" />;
      case 'coworking_space': return <Users className="w-4 h-4" />;
      case 'warehouse': return <Package className="w-4 h-4" />;
      case 'retail_mall': return <ShoppingBag className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Project Master</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage project master data across different categories</p>
        </div>
        {user?.role === 'admin' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => downloadTemplate('projects')}
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
            { id: 'corporate_building', label: 'Corporate Building' },
            { id: 'coworking_space', label: 'Coworking Space' },
            { id: 'warehouse', label: 'Warehouse' },
            { id: 'retail_mall', label: 'Retail / Mall' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getTabIcon(tab.id)}
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {projects.filter(p => p.type === tab.id).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="overflow-hidden">
        <DataTable
          data={filteredProjects}
          columns={getColumns()}
          actions={filteredActions}
          searchable={true}
          exportable={true}
          importable={user?.role === 'admin'}
          onExport={handleExport}
          title={`${getTabLabel(activeTab)} Projects`}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingProject ? `Edit ${getTabLabel(activeTab)}` : `Add ${getTabLabel(activeTab)}`}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value as ProjectMaster['grade'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Developer / Owner *
                </label>
                <input
                  type="text"
                  value={formData.developerOwner}
                  onChange={(e) => setFormData({ ...formData, developerOwner: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectMaster['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Construction">Under Construction</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact No. *
                </label>
                <input
                  type="tel"
                  value={formData.contactNo}
                  onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate No.
                </label>
                <input
                  type="tel"
                  value={formData.alternateNo}
                  onChange={(e) => setFormData({ ...formData, alternateNo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Location Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Location
                </label>
                <input
                  type="url"
                  value={formData.googleLocation}
                  onChange={(e) => setFormData({ ...formData, googleLocation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Type-specific fields */}
          {activeTab === 'corporate_building' && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Corporate Building Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. of Floors
                  </label>
                  <input
                    type="number"
                    value={formData.noOfFloors}
                    onChange={(e) => setFormData({ ...formData, noOfFloors: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Plate
                  </label>
                  <input
                    type="text"
                    value={formData.floorPlate}
                    onChange={(e) => setFormData({ ...formData, floorPlate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'coworking_space' && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Coworking Space Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. of Seats
                  </label>
                  <input
                    type="number"
                    value={formData.noOfSeats}
                    onChange={(e) => setFormData({ ...formData, noOfSeats: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability of Seats
                  </label>
                  <input
                    type="number"
                    value={formData.availabilityOfSeats}
                    onChange={(e) => setFormData({ ...formData, availabilityOfSeats: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per Open Desk Cost
                  </label>
                  <input
                    type="number"
                    value={formData.perOpenDeskCost}
                    onChange={(e) => setFormData({ ...formData, perOpenDeskCost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per Dedicated Desk Cost
                  </label>
                  <input
                    type="number"
                    value={formData.perDedicatedDeskCost}
                    onChange={(e) => setFormData({ ...formData, perDedicatedDeskCost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setup Fees
                  </label>
                  <input
                    type="number"
                    value={formData.setupFees}
                    onChange={(e) => setFormData({ ...formData, setupFees: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'warehouse' && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Warehouse Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No. of Warehouses
                  </label>
                  <input
                    type="number"
                    value={formData.noOfWarehouses}
                    onChange={(e) => setFormData({ ...formData, noOfWarehouses: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warehouse Size
                  </label>
                  <input
                    type="text"
                    value={formData.warehouseSize}
                    onChange={(e) => setFormData({ ...formData, warehouseSize: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'retail_mall' && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Retail / Mall Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Area
                  </label>
                  <input
                    type="text"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Efficiency
                  </label>
                  <input
                    type="text"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Plate Area
                  </label>
                  <input
                    type="text"
                    value={formData.floorPlateArea}
                    onChange={(e) => setFormData({ ...formData, floorPlateArea: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Pricing & Additional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rent Per Sqft *
                </label>
                <input
                  type="number"
                  value={formData.rentPerSqft}
                  onChange={(e) => setFormData({ ...formData, rentPerSqft: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CAM Per Sqft *
                </label>
                <input
                  type="number"
                  value={formData.camPerSqft}
                  onChange={(e) => setFormData({ ...formData, camPerSqft: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <textarea
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="List amenities..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Additional remarks..."
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
              {editingProject ? `Update ${getTabLabel(activeTab)}` : `Create ${getTabLabel(activeTab)}`}
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
        {selectedProject && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900 font-medium">{selectedProject.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Grade</label>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  selectedProject.grade === 'A' ? 'bg-green-100 text-green-800' :
                  selectedProject.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Grade {selectedProject.grade}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Developer / Owner</label>
                <p className="text-sm text-gray-900">{selectedProject.developerOwner}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  selectedProject.status === 'Active' ? 'bg-green-100 text-green-800' :
                  selectedProject.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedProject.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Contact No.</label>
                <p className="text-sm text-gray-900">{selectedProject.contactNo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{selectedProject.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">City</label>
                <p className="text-sm text-gray-900">{selectedProject.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Location</label>
                <p className="text-sm text-gray-900">{selectedProject.location}</p>
              </div>
            </div>

            {/* Type-specific details */}
            {selectedProject.type === 'corporate_building' && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Corporate Building Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">No. of Floors</label>
                    <p className="text-sm text-gray-900">{selectedProject.noOfFloors || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Floor Plate</label>
                    <p className="text-sm text-gray-900">{selectedProject.floorPlate || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Pricing Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Rent Per Sqft</label>
                  <p className="text-sm text-gray-900">₹{selectedProject.rentPerSqft}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">CAM Per Sqft</label>
                  <p className="text-sm text-gray-900">₹{selectedProject.camPerSqft}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Amenities</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{selectedProject.amenities || 'No amenities listed'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Remark</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{selectedProject.remark || 'No remarks'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsManager;
