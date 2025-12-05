import { Plus, X } from "lucide-react";
import React, { useState } from "react";

export default function Sprint({
  sprintName,
  setSprintName,
  goal,
  setGoal,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sprints,
  loading,
  handleSprintCreate,
  handleWeekSelect,
  selectedWeek,
}) {
  const [showModal, setShowModal] = useState(false);

  const handleCreate = () => {
    handleSprintCreate();
    setShowModal(false);
  };

  return (
    <div className="bg-gray-100 rounded-3xl p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sprint</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl px-3 py-2 shadow-md"
        >
          <Plus size={18} className="mr-1" /> Create Sprint
        </button>
      </div>

      {/* ============== MODAL ============== */}
      {showModal && (
        <div className="fixed inset-0 bg-white/70 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg shadow-xl">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Sprint</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="text-gray-500 hover:text-black" />
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                placeholder="Sprint Name"
                value={sprintName}
                onChange={(e) => setSprintName(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-300"
              />

              <input
                type="text"
                placeholder="Sprint Goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-300"
              />
            </div>

            {/* Week Selection */}
            <div className="flex gap-3 mb-4">
              {[1, 2, 4].map((week) => (
                <button
                  key={week}
                  onClick={() => handleWeekSelect(week)}
                  className={`px-4 py-2 rounded-2xl text-white ${
                    selectedWeek === week
                      ? "bg-gradient-to-r from-blue-500 to-blue-700"
                      : "bg-gray-400"
                  }`}
                >
                  Week {week}
                </button>
              ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-300"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-300"
              />
            </div>

            {/* Modal Add Button */}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-2xl mt-2 shadow-md"
            >
              {loading ? "Adding..." : "Add Sprint"}
            </button>
          </div>
        </div>
      )}
      {/* ============== END MODAL ============== */}

      {/* Sprint List */}
      <div className="space-y-3 mt-6">
        {sprints.length === 0 && (
          <p className="text-center text-gray-400 italic">
            No sprints yet. Start by adding one!
          </p>
        )}

        {sprints.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-3xl bg-white shadow-md flex justify-between"
          >
            <p className="text-lg font-bold">{s.name}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
}
