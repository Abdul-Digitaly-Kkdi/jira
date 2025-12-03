import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import ProjectsPage from './pages/ProjectsPage'
import EmployeesPage from './pages/EmployeesPage'
import TimeTrackingPage from './pages/TimeTrackingPage'
import Login from './Authendication/Login'
import ProtectedRoute from './ProtectedRoute'

export default function App() {
  return (
    <Routes>

      {/* Login should NOT have MainLayout */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="timetracking" element={<TimeTrackingPage />} />
      </Route>

      {/* If user enters wrong route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
