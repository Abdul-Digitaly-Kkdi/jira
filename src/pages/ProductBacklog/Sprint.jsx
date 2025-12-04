import React from "react";

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
  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-3xl shadow-xl mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          placeholder="Sprint Name"
          value={sprintName}
          onChange={(e) => setSprintName(e.target.value)}
          className="px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm transition"
        />
        <input
          type="text"
          placeholder="Sprint Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm transition"
        />
      </div>

      <div className="flex gap-4 mb-6">
        {[1, 2, 4].map((week) => (
          <button
            key={week}
            onClick={() => handleWeekSelect(week)}
            className={`px-4 py-2 rounded-2xl text-white transition ${
              selectedWeek === week
                ? "bg-gradient-to-r from-blue-500 to-blue-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm transition"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm transition"
        />
      </div>

      <button
        onClick={handleSprintCreate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 mb-6"
      >
        {loading ? "Adding..." : "Add Sprint"}
      </button>

      <div className="space-y-4 flex flex-col gap-y-2.5 mt-5">
        {sprints.length === 0 && (
          <p className="text-center text-gray-400 italic">
            No sprints yet. Start by adding one!
          </p>
        )}

        {sprints.map((s, idx) => (
          <div
            key={s.id}
            className="p-5 rounded-3xl   flex justify-between items-center shadow-md hover:-translate-y-1 transition-transform"
            
          >
            <div>
              <p className="text-lg font-bold">{s.name}</p>
            </div>

            
          </div>
        ))}
      </div>
    </div>
  );
}
