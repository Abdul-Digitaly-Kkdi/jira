import React, { useEffect, useState } from "react";
import {
  getProjectById,
  removeProjectMember,
  addProjectMember,
  getAllUsers,
} from "../API/ProjectAPI";
import {
  Calendar,
  User,
  Users,
  Layers,
  Tag,
  Info,
  Trash2,
  CirclePlus,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ProjectSummary({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // ADD MEMBER
  const [showAddModal, setShowAddModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchProject();
    loadUsers();
  }, [projectId]);

  async function loadUsers() {
    try {
      const data = await getAllUsers();
      setAllUsers(data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  }

  async function fetchProject() {
    setLoading(true);
    try {
      const data = await getProjectById(projectId);

      const formatted = {
        ...data,
        projectLead: data.project_lead,
        platform: data.platform || "Not Assigned",
        start_date: data.start_date,
        end_date: data.end_date,
        assignedEmployees:
          data.members?.map((m) => ({
            id: m.id,
            full_name: m.name,
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

  // DELETE MEMBER
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

      toast.success("Employee removed successfully!");
    } catch (error) {
      console.error("Error removing employees:", error);
    }
  };

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((emp) => emp !== id) : [...prev, id]
    );
  };

  // ADD MEMBER
  const handleAddMember = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Select user & role");
      return;
    }

    try {
      await addProjectMember(project.id, selectedUser, selectedRole);

      toast.success("Member added!");

      setShowAddModal(false);
      setSelectedUser("");
      setSelectedRole("");

      fetchProject(); // Refresh
    } catch (err) {
      console.log("Add member error:", err);
      toast.error("Failed to add member");
    }
  };

  if (loading)
    return <div className="p-6 text-gray-500 animate-pulse">Loading project...</div>;

  if (!project)
    return <div className="p-6 text-red-500">Project not found</div>;

  return (
    <div
      className="p-8 space-y-8 overflow-y-auto"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-7 rounded-3xl shadow-lg">
        <h1 className="flex items-center gap-3 text-2xl font-bold">
          <Layers size={26} /> Project Summary
        </h1>
        <p className="mt-2 text-3xl font-semibold">{project.name}</p>
      </div>
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="glass-card">
            <div className="card-header">
              <Tag className="text-indigo-600" />
              <h2>Project Key</h2>
            </div>
            <p className="card-value">{project.key}</p>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <Info className="text-indigo-600" />
              <h2>Platform</h2>
            </div>
            <p className="card-value">{project.platform}</p>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <Calendar className="text-indigo-600" />
              <h2>Timeline</h2>
            </div>
            <p><b>Start:</b> {project.start_date}</p>
            <p><b>End:</b> {project.end_date}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="glass-card">
            <div className="card-header">
              <User className="text-indigo-600" />
              <h2>Project Lead</h2>
            </div>
            <p className="card-value">{project.projectLead.name}</p>
          </div>

          <div className="glass-card">
            <div className="flex justify-between items-center">
              <div className="card-header">
                <Users className="text-indigo-600" />
                <h2>Team Members</h2>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex gap-2 bg-blue-600 px-4 py-2 text-white rounded-xl text-sm shadow"
                >
                  <CirclePlus size={20} /> Add
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-1 bg-red-600 px-4 py-2 text-white rounded-xl text-sm shadow"
                >
                  <Trash2 size={15} /> Remove
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {project.assignedEmployees.length ? (
                project.assignedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex justify-between items-center bg-gray-100 py-2 px-4 rounded-xl shadow-sm"
                  >
                    <span className="font-semibold">{emp.full_name}</span>
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
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-gray-700">{project.description}</p>
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center  z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl">

            <h3 className="text-xl font-semibold mb-4">Add Member</h3>

            <select
              className="w-full p-2 border rounded-lg mb-4"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.full_name}
                </option>
              ))}
            </select>
            <div className="mt-5">
               <select
              className="w-full p-2   border rounded-lg mb-4"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="developer">Developer</option>
              <option value="testing">Testing</option>
              <option value="dev">Dev</option>
            </select>

            </div>

           

            <div className="flex justify-end mt-5 gap-3">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleAddMember}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">Remove Employees</h3>
            <p className="text-gray-600 mb-5">
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
