import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { createEpic, getEpic } from "../../API/ProjectAPI";
import toast, { Toaster } from "react-hot-toast";

export default function Epic({ projectId }) {
  const [epicName, setEpicName] = useState("");
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEpics();
  }, []);

  const fetchEpics = async () => {
    try {
      const res = await getEpic(projectId);
      setEpics(res);
    } catch (err) {
      toast.error("Failed to fetch epics");
    }
  };

  const handleEpicCreate = async () => {
    if (!epicName.trim()) {
      toast.error("Epic name cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const body = {
        name: epicName,
        project_id: projectId,
        description: "No description",
      };

      const newEpic = await createEpic(body);
      setEpics((prev) => [...prev, newEpic]);
      setEpicName("");
      toast.success("Epic created successfully!");
    } catch (err) {
      toast.error("Epic creation failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl sm:p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Epics
      </h2>

      {/* Input + Add Button */}
      <div className="flex flex-col s gap-4 mb-6">
        <input
          type="text"
          placeholder="New Epic Name"
          value={epicName}
          onChange={(e) => setEpicName(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
        />
        <button
          onClick={handleEpicCreate}
          disabled={loading}
          className="flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          {loading ? "Adding..." : "Add Epic"}
        </button>
      </div>

      {/* Epic List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {epics.length === 0 && (
          <p className="text-center text-gray-400 italic col-span-full">
            No epics yet. Start by adding one!
          </p>
        )}

        {epics.map((e) => (
          <div
            key={e.id}
            className="flex flex-col j hover:scale-105 transition-transform"
          >
            <h3 className="text-lg font-bold capitalize mb-2">{e.name}</h3>
            <p className="text-xs opacity-70">Epic ID: {e.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
