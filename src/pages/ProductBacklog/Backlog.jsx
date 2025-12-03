import React, { useState, useEffect } from "react";
import { createBacklog, getAllUsers, getEpic } from "../../API/ProjectAPI";
import toast, { Toaster } from "react-hot-toast";

const Backlog = ({ projectId }) => {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    epic: "",
    priority: "",
    assignedTo: "",
    description: "",
  });

  const [epics, setEpics] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEpics() {
      try {
        const res = await getEpic(projectId);
        setEpics(res);
      } catch {
        toast.error("Failed to fetch epics");
      }
    }
    fetchEpics();
  }, [projectId]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await getAllUsers();
        setUsers(res);
      } catch {
        toast.error("Failed to fetch users");
      }
    }
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.title || !formData.epic || !formData.priority || !formData.assignedTo) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      await createBacklog({ ...formData, project_id: projectId });
      toast.success("Backlog created successfully!");
      setFormData({
        type: "",
        title: "",
        epic: "",
        priority: "",
        assignedTo: "",
        description: "",
      });
    } catch {
      toast.error("Error creating backlog");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create Backlog</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Type */}
        <div className="relative">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm appearance-none bg-white"
          >
            <option value="" disabled hidden>Select Type</option>
            <option value="task">Task</option>
            <option value="story">Story</option>
            <option value="bug">Bug</option>
          </select>
          <label className="absolute top-1 left-4 text-gray-500 text-sm pointer-events-none transition-all duration-200">
            Type
          </label>
        </div>

        {/* Priority */}
        <div className="relative">
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm appearance-none bg-white"
          >
            <option value="" disabled hidden>Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <label className="absolute top-1 left-4 text-gray-500 text-sm pointer-events-none transition-all duration-200">
            Priority
          </label>
        </div>

        {/* Title */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            placeholder=" "
          />
          <label className="absolute top-1 left-4 text-gray-500 text-sm pointer-events-none transition-all duration-200">
            Title
          </label>
        </div>

        {/* Epic */}
        <div className="relative">
          <select
            name="epic"
            value={formData.epic}
            onChange={handleChange}
            className="w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm appearance-none bg-white"
          >
            <option value="" disabled hidden>Select Epic</option>
            {epics.map((epic) => (
              <option key={epic.id} value={epic.id}>{epic.name}</option>
            ))}
          </select>
          <label className="absolute top-1 left-4 text-gray-500 text-sm pointer-events-none transition-all duration-200">
            Epic
          </label>
        </div>

        {/* Assign To */}
        <div className="relative">
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm appearance-none bg-white"
          >
            <option value="" disabled hidden>Select Employee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.full_name}</option>
            ))}
          </select>
          <label className="absolute top-1 left-4 text-gray-500 text-sm pointer-events-none transition-all duration-200">
            Assign To
          </label>
        </div>

        {/* Description */}
        <div className="relative md:col-span-2">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            placeholder=" "
          />
          <label className="absolute top-1 left-4 text-gray-500 text-sm pointer-events-none transition-all duration-200">
            Description
          </label>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Backlog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Backlog;
