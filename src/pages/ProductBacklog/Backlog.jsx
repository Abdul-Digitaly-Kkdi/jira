import React, { useState } from "react";

const Backlog = ({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  backlogs,
  loading,
  epics,
  users,
  sprints,
  onAssignToSprint,
}) => {

  const [selectedSprintId, setSelectedSprintId] = useState("");

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Create Backlog
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* First row: Type, Name, Epic, Priority, Assignee */}
        <div className="flex flex-col  gap-4">
          {/* Type */}
          <div>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300"
            >
              <option value="" disabled hidden>
                Select Type
              </option>
              <option value="task">Task</option>
              <option value="story">Story</option>
              <option value="bug">Bug</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Title / Name"
              className="w-full px-4 py-2 rounded-xl border border-gray-300"
            />
          </div>

          {/* Epic */}
          <div>
            <select
              name="epic_id"
              value={formData.epic_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300"
            >
              <option value="" disabled hidden>
                Select Epic
              </option>
              {epics.map((epic) => (
                <option key={epic.id} value={epic.id}>
                  {epic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300"
            >
              <option value="low">High</option>
              <option value="urgent">Highest</option>
              <option value="medium">Medium</option>
              <option value="high">Low</option>
              <option value="urgent">Lowest</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <select
              name="assignee_id"
              value={formData.assignee_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300"
            >
              <option value="" disabled hidden>
                Select Assignee
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second row: Description */}
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-xl border border-gray-300"
          />
        </div>

        {/* Third row: Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl"
          >
            {loading ? "Creating..." : "Add Backlog"}
          </button>
        </div>
      </form>

      {/* Backlog list */}
      <div className="mt-10">
        <p className="font-bold text-2xl">BackLog Details</p>
        {backlogs.length === 0 ? (
          <p>No backlog items found.</p>
        ) : (
          <ul className="space-y-3">
            {backlogs.map((item) => (
              <li
                key={item.id}
                className="p-4 border  rounded-xl shadow-sm bg-gray-50"
              >
                <h4 className="font-bold">Assigned Employee: {item.name}</h4>
                <p>Type: {item.type} </p>
                <p>Priority: {item.priority}</p>
                <p> Status: {item.status}</p>
                <p> Epic Name: {item.epic_name}</p>

              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-y-2.5">
          <button
            onClick={() => onAssignToSprint(item.id)}
            className="px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          >
            Assign to Sprint
          </button>
          <select
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            className="border rounded-xl px-2 py-1"
          >
            <option value="">Select Sprint</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Backlog;
