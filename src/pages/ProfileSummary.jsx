import React, { useEffect, useState } from "react";
import { getProjectById, removeProjectMember } from "../API/ProjectAPI";
import { Calendar, User, Users, Layers, Tag, Info, Trash2 } from "lucide-react";

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
        assignedEmployees:
          data.members?.map((m) => ({
            id: m.id,
            full_name: m.name,
            email: m.email,
          })) || [],
        startDate: data.start_date,
        endDate: data.end_date,
      };

      setProject(formatted);
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedEmployees.map((empId) => removeProjectMember(project.id, empId))
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
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="p-6">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );

  if (!project)
    return (
      <div className="p-6">
        <p className="text-red-400">No project found</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl shadow-md rounded-2xl p-6 border border-gray-200">
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-3">
          <Layers className="text-indigo-600" /> Project Overview
        </h1>
        <p className="mt-1 text-gray-900 text-xl font-bold">{project.name}</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left Section */}
        <div className="space-y-6">
          {/* Project Key */}
          <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 text-indigo-600">
              <Tag />{" "}
              <h2 className="text-lg font-semibold text-gray-700">
                Project Key
              </h2>
            </div>
            <p className="text-gray-900 text-xl mt-3 font-bold">
              {project.key}
            </p>
          </div>

          {/* Platform */}
          <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 text-indigo-600">
              <Info />{" "}
              <h2 className="text-lg font-semibold text-gray-700">Platform</h2>
            </div>
            <p className="text-gray-900 text-xl mt-3 font-semibold capitalize">
              {project.platform}
            </p>
          </div>

          {/* Dates */}
          <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 text-indigo-600">
              <Calendar />{" "}
              <h2 className="text-lg font-semibold text-gray-700">Timeline</h2>
            </div>

            <div className="mt-4 space-y-2">
              <p>
                <b>Start:</b>{" "}
                <span className="text-gray-700">{project.start_date}</span>
              </p>
              <p>
                <b>End:</b>{" "}
                <span className="text-gray-700">{project.end_date}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Lead */}
          <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 text-indigo-600">
              <User />{" "}
              <h2 className="text-lg font-semibold text-gray-700">
                Project Lead
              </h2>
            </div>
            <p className="text-gray-900 text-xl mt-3 font-bold">
              {project.projectLead?.name || "Not Assigned"}
            </p>
          </div>

          {/* Assigned Employees */}
          <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3 text-indigo-600">
              <div className="flex gap-3 items-center">
                <Users />{" "}
                <h2 className="text-lg font-semibold text-gray-700">
                  Assigned Employees
                </h2>
              </div>
              <div>
                <button
  onClick={() => setShowDeleteModal(true)}
  className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-800 text-white rounded-lg text-sm"
>
  <Trash2 size={16} /> Remove
</button>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {project.assignedEmployees?.length > 0 ? (
                project.assignedEmployees.map((emp) => (
                  <li
                    key={emp.id}
                    className="flex items-center gap-3 text-gray-800 bg-gray-100 px-3 py-2 rounded-lg shadow-sm border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                      className="w-4 h-4"
                    />
                    {emp.full_name}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No employees assigned</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-white/70 backdrop-blur-xl p-6 shadow-md rounded-2xl mt-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Description</h2>
        <p className="text-gray-800 mt-3 leading-relaxed">
          {project.description || "No description added"}
        </p>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">Remove Members</h3>
            <p className="text-sm mb-5">
              Do you want to remove the selected employees from this project?
            </p>

            <div className="flex justify-end gap-3">
              <div>
                <button
                className="px-4 py-1.5 bg-gray-500 text-white rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              </div>
              <div>
                <button
                className="px-4 py-1.5 bg-red-600 text-white rounded-md"
                onClick={handleDelete}
              >
                Remove
              </button>

              </div>
              
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
