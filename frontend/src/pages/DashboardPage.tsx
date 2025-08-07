import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Users, UserCheck, Building2, Home, TrendingUp, DollarSign } from 'lucide-react'

interface DashboardStats {
  total_leads: number
  total_employees: number
  total_projects: number
  total_inventory: number
  recent_leads: any[]
}

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Since we don't have a dedicated stats endpoint, we'll fetch data from multiple endpoints
      const [leads, employees, projects, inventory] = await Promise.all([
        api.get('/leads'),
        api.get('/employees'),
        api.get('/projects'),
        api.get('/inventory'),
      ])
      
      return {
        total_leads: leads.data.length,
        total_employees: employees.data.length,
        total_projects: projects.data.length,
        total_inventory: inventory.data.length,
        recent_leads: leads.data.slice(0, 5),
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.total_leads || 0,
      icon: UserCheck,
      color: 'bg-blue-500',
    },
    {
      title: 'Employees',
      value: stats?.total_employees || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Projects',
      value: stats?.total_projects || 0,
      icon: Building2,
      color: 'bg-purple-500',
    },
    {
      title: 'Inventory',
      value: stats?.total_inventory || 0,
      icon: Home,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Real Estate CRM</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
          </div>
          <div className="p-6">
            {stats?.recent_leads?.length ? (
              <div className="space-y-4">
                {stats.recent_leads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.company || 'No company'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {lead.
                      'bg-green-100 text-green-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent leads</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <a
                href="/leads"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <UserCheck className="h-5 w-5 text-blue-500 mr-3" />
                <span className="font-medium">Add New Lead</span>
              </a>
              <a
                href="/projects"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Building2 className="h-5 w-5 text-purple-500 mr-3" />
                <span className="font-medium">Create Project</span>
              </a>
              <a
                href="/inventory"
                className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Home className="h-5 w-5 text-orange-500 mr-3" />
                <span className="font-medium">Add Inventory</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
