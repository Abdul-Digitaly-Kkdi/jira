import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import ProjectsPage from './pages/ProjectsPage'
import EmployeesPage from './pages/EmployeesPage'
import TimeTrackingPage from './pages/TimeTrackingPage'

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/timetracking" element={<TimeTrackingPage />} />
      </Routes>
    </MainLayout>
  )
}
