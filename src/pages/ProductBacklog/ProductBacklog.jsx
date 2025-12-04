  import React, { useState, useEffect } from "react";
  import { Calendar, Layers, ListChecks, MoreHorizontal } from "lucide-react";
  import Backlog from "./Backlog";
  import Epic from "./Epic";
  import Sprint from "./Sprint";
  import { createEpic, getEpic, createSprint, getSprint, createBacklog, getBacklogData, getAllUsers } from "../../API/ProjectAPI";
  import toast, { Toaster } from "react-hot-toast";

  const ProductBacklog = ({ projectId }) => {
    // --- Epics state ---
    const [epics, setEpics] = useState([]);
    const [epicName, setEpicName] = useState("");
    const [epicLoading, setEpicLoading] = useState(false);

    // --- Sprints state ---
    const [sprints, setSprints] = useState([]);
    const [sprintName, setSprintName] = useState("");
    const [goal, setGoal] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sprintLoading, setSprintLoading] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);

    // --- Backlogs state ---
    const [backlogs, setBacklogs] = useState([]);
    const [backlogLoading, setBacklogLoading] = useState(false);
    const [backlogForm, setBacklogForm] = useState({
      type: "",
      title: "",
      name: "",
      epic_id: "",
      description: "",
      priority: "medium",
      assignee_id: "",
    });
    const [users, setUsers] = useState([]);

    // --- Fetch on mount ---
    useEffect(() => {
      fetchEpics();
      fetchSprints();
      fetchBacklogs();
      fetchUsers();
    }, []);

    // --- Epic functions ---
    const fetchEpics = async () => {
      try {
        const res = await getEpic(projectId);
        setEpics(res);
      } catch {
        toast.error("Failed to fetch epics");
      }
    };

    const handleEpicCreate = async () => {
      if (!epicName.trim()) { toast.error("Epic name cannot be empty!"); return; }
      setEpicLoading(true);
      try {
        const newEpic = await createEpic({ name: epicName, project_id: projectId, description: "No description" });
        setEpics(prev => [...prev, newEpic]);
        setEpicName("");
        toast.success("Epic created successfully!");
      } catch {
        toast.error("Epic creation failed");
      }
      setEpicLoading(false);
    };

    // --- Sprint functions ---
    const fetchSprints = async () => {
      try {
        const res = await getSprint(projectId);
        setSprints(res);
      } catch {
        toast.error("Failed to fetch sprints");
      }
    };

    const handleSprintCreate = async () => {
      if (!sprintName || !goal || !startDate || !endDate) { toast.error("All fields are required!"); return; }
      setSprintLoading(true);
      try {
        const newSprint = await createSprint({
          name: sprintName,
          project_id: projectId,
          goal,
          start_date: `${startDate}T00:00:00`,
          end_date: `${endDate}T23:59:59`,
        });
        setSprints(prev => [...prev, newSprint]);
        setSprintName(""); setGoal(""); setStartDate(""); setEndDate(""); setSelectedWeek(null);
        toast.success("Sprint created successfully!");
      } catch {
        toast.error("Sprint creation failed");
      }
      setSprintLoading(false);
    };

    const handleWeekSelect = (week) => {
      const today = new Date();
      let end;
      switch (week) {
        case 1: end = new Date(today); end.setDate(today.getDate() + 7); break;
        case 2: end = new Date(today); end.setDate(today.getDate() + 14); break;
        case 4: end = new Date(today); end.setDate(today.getDate() + 30); break;
        default: end = today;
      }
      const formatDate = d => d.toISOString().split("T")[0];
      setStartDate(formatDate(today));
      setEndDate(formatDate(end));
      setSelectedWeek(week);
    };

    // --- Backlog functions ---
    const fetchBacklogs = async () => {
      try {
        const res = await getBacklogData(projectId);
        setBacklogs(res);
      } catch {
        toast.error("Failed to fetch backlogs");
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res);
      } catch {
        toast.error("Failed to fetch users");
      }
    };

    const handleBacklogChange = (e) => {
      setBacklogForm({ ...backlogForm, [e.target.name]: e.target.value });
    };

    const handleBacklogCreate = async () => {
      const { type, name, epic_id } = backlogForm;
      if (!type || !name || !epic_id) { toast.error("Please fill all required fields!"); return; }
      setBacklogLoading(true);
      try {
        await createBacklog({ project_id: projectId, ...backlogForm });
        toast.success("Backlog created successfully!");
        setBacklogForm({ type: "", name: "", epic_id: "", description: "", priority: "medium", assignee_id: "" ,title: ""});
        fetchBacklogs();
      } catch {
        toast.error("Error creating backlog");
      }
      setBacklogLoading(false);
    };
  // Parent Page
  const handleAssignToSprint = async (backlogId, sprintId) => {
    if (!sprintId) {
      toast.error("Please select a sprint first!");
      return;
    }
    try {
      const payload = { issue_ids: [backlogId] }; // API expects array
      await sprintTaskMove(sprintId, payload);
      toast.success("Backlog assigned to sprint!");
      fetchBacklogs(); // refresh backlog list if needed
      fetchSprints(); // refresh sprint list if needed
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign backlog to sprint.");
    }
  };




   return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-100 to-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
        🗂 Project Backlog Dashboard
      </h1>

      {/* Horizontal card layout */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Backlog Card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl flex-1 flex flex-col hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <ListChecks className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-semibold text-gray-800">Backlog</h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 max-h-[550px]">
            <Backlog
              formData={backlogForm}
              setFormData={setBacklogForm}
              handleChange={handleBacklogChange}
              handleSubmit={handleBacklogCreate}
              backlogs={backlogs}
              loading={backlogLoading}
              epics={epics}
              users={users}
              sprints={sprints}
              onAssignToSprint={handleAssignToSprint}
            />
          </div>
        </div>

        {/* Sprint Card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl flex-1 flex flex-col hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-800">Sprints</h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 max-h-[550px]">
            <Sprint
              sprintName={sprintName}
              setSprintName={setSprintName}
              goal={goal}
              setGoal={setGoal}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              sprints={sprints}
              loading={sprintLoading}
              handleSprintCreate={handleSprintCreate}
              handleWeekSelect={handleWeekSelect}
              selectedWeek={selectedWeek}
            />
          </div>
        </div>

        {/* Epic Card */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl flex-1 flex flex-col hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center gap-3 p-6 border-b border-gray-100">
            <Layers className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-semibold text-gray-800">Epics</h2>
          </div>
          <div className="p-4 overflow-y-auto flex-1 max-h-[550px]">
            <Epic
              epicName={epicName}
              setEpicName={setEpicName}
              epics={epics}
              loading={epicLoading}
              handleEpicCreate={handleEpicCreate}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

  export default ProductBacklog;
