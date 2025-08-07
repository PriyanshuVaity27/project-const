import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { LeadsPage } from './pages/LeadsPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { DevelopersPage } from './pages/DevelopersPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { InventoryPage } from './pages/InventoryPage'
import { LandParcelsPage } from './pages/LandParcelsPage'
import { ContactsPage } from './pages/ContactsPage'
import { EnquiriesPage } from './pages/EnquiriesPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/employees" element={<EmployeesPage />} />
                  <Route path="/developers" element={<DevelopersPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/land-parcels" element={<LandParcelsPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/enquiries" element={<EnquiriesPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
