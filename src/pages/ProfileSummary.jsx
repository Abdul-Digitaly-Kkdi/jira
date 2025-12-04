import React, { useEffect, useState } from "react";
import { getProjectById, removeProjectMember } from "../API/ProjectAPI";
import {
  Calendar,
  User,
  Users,
  Layers,
  Tag,
  Info,
  Trash2,
} from "lucide-react";

export default function ProjectSummary({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    setLoading(true);
    try {
      const data = await getProjectById(projectId);

      const formatted = {
        ...data,
        projectLead: data.project_lead,
        start_date: data.start_date || data.startDate || "",
  end_date: data.end_date || data.endDate || "",
        assignedEmployees:
  data.members?.map((m) => ({
    id: m.id,
    full_name: m.full_name,
    email: m.email,
  })) || [],

      };

      setProject(formatted);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedEmployees.map((empId) =>
          removeProjectMember(project.id, empId)
        )
      );

      setProject((prev) => ({
        ...prev,
        assignedEmployees: prev.assignedEmployees.filter(
          (emp) => !selectedEmployees.includes(emp.id)
        ),
      }));

      setSelectedEmployees([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error removing employees:", error);
    }
  };

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((emp) => emp !== id)
        : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="p-6 animate-pulse text-gray-500 text-lg">
        Loading project...
      </div>
    );

  if (!project)
    return (
      <div className="p-6 text-red-500 text-lg font-semibold">
        Project not found
      </div>
    );

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-7 rounded-3xl shadow-lg">
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <Layers size={26} /> Project Summary
        </h1>
        <p className="mt-2 text-3xl font-semibold tracking-wide">
          {project.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="space-y-6">

          {/* Project Key */}
          <div className="glass-card">
            <div className="card-header">
              <Tag className="text-indigo-600" />
              <h2>Project Key</h2>
            </div>
            <p className="card-value">{project.key}</p>
          </div>

          {/* Platform */}
          <div className="glass-card">
            <div className="card-header">
              <Info className="text-indigo-600" />
              <h2>Platform</h2>
            </div>
            <p className="card-value capitalize">
              {project.platform}
            </p>
          </div>

          {/* Timeline */}
          <div className="glass-card">
            <div className="card-header">
              <Calendar className="text-indigo-600" />
              <h2>Timeline</h2>
            </div>

            <div className="mt-4 space-y-2 ">
              <p>
                <b>Start:</b> {project.start_date}
              </p>
              <p>
                <b>End:</b> {project.end_date}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* Lead */}
          <div className="glass-card">
            <div className="card-header">
              <User className="text-indigo-600" />
              <h2>Project Lead</h2>
            </div>
            <p className="card-value">
              {project.projectLead.name || "Not Assigned"}
            </p>
          </div>

          {/* Assigned Employees */}
          <div className="glass-card">

            <div className="flex justify-between items-center">
              <div className="card-header !mb-0">
                <Users className="text-indigo-600" />
                <h2>Team Members</h2>
              </div>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm shadow"
              >
                <Trash2 size={15} /> Remove
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {project.assignedEmployees.length ? (
                project.assignedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex justify-between items-center bg-gray-100 py-2 px-4 rounded-xl shadow-sm"
                  >
                    <div className="font-semibold text-gray-700">
                      {emp.full_name}
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No employees assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="glass-card">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {project.description || "No description added"}
        </p>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">Remove Employees</h3>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to remove selected employees?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1.5 bg-gray-400 text-white rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg"
                onClick={handleDelete}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
