import React from "react";
import { Plus } from "lucide-react";

export default function Epic({ epicName, setEpicName, epics, loading, handleEpicCreate }) {
  return (
    <div className="max-w-2xl p-6">
      {/* Input + Add Button */}
      <div className="flex flex-col gap-4 mb-6">
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
            className="flex flex-col hover:scale-105 transition-transform"
          >
            <h3 className="text-lg font-bold capitalize mb-2">{e.name}</h3>
            <p className="text-xs opacity-70">Epic ID: {e.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
