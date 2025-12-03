import React, { useState, useEffect } from "react";
import { createSprint, getSprint } from "../../API/ProjectAPI";
import toast, { Toaster } from "react-hot-toast";

export default function Sprint({ projectId }) {
  const [sprintName, setSprintName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null); // track selected week

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      const res = await getSprint(projectId);
      setSprints(res);
    } catch (err) {
      toast.error("Failed to fetch sprints");
    }
  };

  const handleSprintCreate = async () => {
    if (!sprintName || !goal || !startDate || !endDate) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const body = {
        name: sprintName,
        project_id: projectId,
        goal,
        start_date: startDate,
        end_date: endDate,
      };

      const newSprint = await createSprint(body);
      setSprints((prev) => [...prev, newSprint]);

      setSprintName("");
      setGoal("");
      setStartDate("");
      setEndDate("");
      setSelectedWeek(null);

      toast.success("Sprint created successfully!");
    } catch (err) {
      toast.error("Sprint creation failed");
    }
    setLoading(false);
  };

  const handleWeekSelect = (week) => {
    const today = new Date();
    let end;

    switch (week) {
      case 1:
        end = new Date(today);
        end.setDate(today.getDate() + 7);
        break;
      case 2:
        end = new Date(today);
        end.setDate(today.getDate() + 14);
        break;
      case 4:
        end = new Date(today);
        end.setDate(today.getDate() + 30);
        break;
      default:
        end = today;
    }

    const formatDate = (date) => date.toISOString().split("T")[0];

    setStartDate(formatDate(today));
    setEndDate(formatDate(end));
    setSelectedWeek(week);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-3xl shadow-xl mt-6">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
         Create Sprint
      </h2>

      {/* Input Fields */}
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

      {/* Week Buttons */}
      <div className="flex  gap-4 mb-6">
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
      

      {/* Add Button */}
      <button
        onClick={handleSprintCreate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-2xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {loading ? "Adding..." : "Add Sprint"}
      </button>

      {/* Sprint List */}
      <div className="space-y-4">
        {sprints.length === 0 && (
          <p className="text-center text-gray-400 italic">
            No sprints yet. Start by adding one!
          </p>
        )}

        {sprints.map((s, idx) => (
          <div
            key={s.id}
            className="p-5 rounded-3xl text-white flex justify-between items-center shadow-md transition-transform hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, hsl(${
                (idx * 60) % 360
              }, 70%, 50%), hsl(${(idx * 60 + 60) % 360}, 70%, 40%))`,
            }}
          >
            <div>
              <p className="text-lg font-bold">{s.name}</p>
              <p className="text-sm opacity-80 mt-1">{s.goal}</p>
            </div>
            <span className="text-xs font-mono opacity-70">
              {s.start_date} → {s.end_date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
