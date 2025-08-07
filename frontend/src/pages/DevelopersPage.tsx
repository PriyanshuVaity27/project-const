import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Developer } from '../types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Plus, Search, Download, Eye, Edit, Trash2 } from 'lucide-react'
import { exportToCSV } from '../lib/utils'
import toast from 'react-hot-toast'

export function DevelopersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: developers, isLoading } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      const response = await api.get('/developers')
      return response.data as Developer[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Developer>) => {
      const response = await api.post('/developers', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] })
      setIsCreateModalOpen(false)
      toast.success('Developer created successfully')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Developer> }) => {
      const response = await api.put(`/developers/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] })
      setIsEditModalOpen(false)
      setSelectedDeveloper(null)
      toast.success('Developer updated successfully')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/developers/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developers'] })
      toast.success('Developer deleted successfully')
    },
  })

  const filteredDevelopers = developers?.filter(developer =>
    developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    developer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    developer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleExport = () => {
    if (filteredDevelopers.length > 0) {
      exportToCSV(filteredDevelopers, 'developers')
      toast.success('Developers exported successfully')
    }
  }

  const handleView = (developer: Developer) => {
    setSelectedDeveloper(developer)
    setIsViewModalOpen(true)
  }

  const handleEdit = (developer: Developer) => {
    setSelectedDeveloper(developer)
    setIsEditModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this developer?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developers</h1>
          <p className="text-gray-600">Manage property developers</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Developer
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search developers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Developer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Established
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevelopers.map((developer) => (
                <tr key={developer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{developer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {developer.contact_person || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{developer.email || '-'}</div>
                    <div className="text-sm text-gray-500">{developer.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {developer.established_year || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {developer.total_projects || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(developer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(developer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(developer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Developer Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Developer"
        size="lg"
      >
        <DeveloperForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
        />
      </Modal>

      {/* View Developer Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Developer Details"
        size="lg"
      >
        {selectedDeveloper && <DeveloperDetails developer={selectedDeveloper} />}
      </Modal>

      {/* Edit Developer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Developer"
        size="lg"
      >
        {selectedDeveloper && (
          <DeveloperForm
            developer={selectedDeveloper}
            onSubmit={(data) => updateMutation.mutate({ id: selectedDeveloper.id, data })}
            loading={updateMutation.isPending}
          />
        )}
      </Modal>
    </div>
  )
}

function DeveloperForm({ developer, onSubmit, loading }: {
  developer?: Developer
  onSubmit: (data: Partial<Developer>) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    name: developer?.name || '',
    contact_person: developer?.contact_person || '',
    email: developer?.email || '',
    phone: developer?.phone || '',
    address: developer?.address || '',
    website: developer?.website || '',
    established_year: developer?.established_year || '',
    total_projects: developer?.total_projects || '',
    description: developer?.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Developer Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Contact Person"
          value={formData.contact_person}
          onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Input
          label="Website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Established Year"
          value={formData.established_year}
          onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
        />
        <Input
          label="Total Projects"
          value={formData.total_projects}
          onChange={(e) => setFormData({ ...formData, total_projects: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" loading={loading}>
          {developer ? 'Update Developer' : 'Create Developer'}
        </Button>
      </div>
    </form>
  )
}

function DeveloperDetails({ developer }: { developer: Developer }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Developer Name</label>
        <p className="mt-1 text-sm text-gray-900">{developer.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Person</label>
          <p className="mt-1 text-sm text-gray-900">{developer.contact_person || '-'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{developer.email || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <p className="mt-1 text-sm text-gray-900">{developer.phone || '-'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <p className="mt-1 text-sm text-gray-900">
            {developer.website ? (
              <a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {developer.website}
              </a>
            ) : '-'}
          </p>
        </div>
      </div>

      {developer.address && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <p className="mt-1 text-sm text-gray-900">{developer.address}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Established Year</label>
          <p className="mt-1 text-sm text-gray-900">{developer.established_year || '-'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Projects</label>
          <p className="mt-1 text-sm text-gray-900">{developer.total_projects || '-'}</p>
        </div>
      </div>

      {developer.description && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <p className="mt-1 text-sm text-gray-900">{developer.description}</p>
        </div>
      )}
    </div>
  )
}
