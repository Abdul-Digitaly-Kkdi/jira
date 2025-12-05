import React, { useState, useEffect } from "react";
import { Calendar, Layers, ListChecks, MoreHorizontal } from "lucide-react";
import Backlog from "./Backlog";
import Epic from "./Epic";
import Sprint from "./Sprint";
import {
  createEpic,
  getEpic,
  createSprint,
  getSprint,
  createBacklog,
  getBacklogData,
  getAllUsers,
  sprintTaskMove,
} from "../../API/ProjectAPI";
import toast, { Toaster } from "react-hot-toast";

const ProductBacklog = ({ projectId }) => {
  // --- Epics state ---
  const [epics, setEpics] = useState([]);
  const [epicName, setEpicName] = useState("");
  const [epicLoading, setEpicLoading] = useState(false);
  const [selectedEpicId, setSelectedEpicId] = useState(null);
  const [showEpic, setShowEpic] = useState(false);

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
    if (!epicName.trim()) {
      toast.error("Epic name cannot be empty!");
      return;
    }
    setEpicLoading(true);
    try {
      const newEpic = await createEpic({
        name: epicName,
        project_id: projectId,
        description: "No description",
      });
      setEpics((prev) => [...prev, newEpic]);
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
    if (!sprintName || !goal || !startDate || !endDate) {
      toast.error("All fields are required!");
      return;
    }
    setSprintLoading(true);
    try {
      const newSprint = await createSprint({
        name: sprintName,
        project_id: projectId,
        goal,
        start_date: `${startDate}T00:00:00`,
        end_date: `${endDate}T23:59:59`,
      });
      setSprints((prev) => [...prev, newSprint]);
      setSprintName("");
      setGoal("");
      setStartDate("");
      setEndDate("");
      setSelectedWeek(null);
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
    const formatDate = (d) => d.toISOString().split("T")[0];
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
    const { type, name, epic_id,  } = backlogForm;
    if (!type || !name || !epic_id  ) {
      toast.error("Please fill all required fields!");
      return;
    }
    setBacklogLoading(true);
    try {
      await createBacklog({
  project_id: projectId,
  name: backlogForm.name,       
  summary: backlogForm.title,
  type: backlogForm.type,
  epic_id: backlogForm.epic_id,
  description: backlogForm.description,
  priority: backlogForm.priority,
  assignee_id: backlogForm.assignee_id,
});


      toast.success("Backlog created successfully!");
      setBacklogForm({
        type: "",
        name: "",
        epic_id: "",
        description: "",
        priority: "medium",
        assignee_id: "",
        title: "",
      });
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
      const payload = { issue_ids: [backlogId] }; 
      await sprintTaskMove(sprintId, payload);
      toast.success("Backlog assigned to sprint!");
      fetchBacklogs(); 
      fetchSprints(); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign backlog to sprint.");
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-100 to-gray-50 min-h-screen">
      <button
        onClick={() => setShowEpic(!showEpic)}
        className={`rounded-xl absolute px-2 py-2 cursor-pointer right-0 top-0 text-white transition-all duration-200
    ${showEpic ? "bg-red-500" : "bg-blue-500"}
  `}
      >
        {showEpic ? "Hide Epics" : "Show Epics"}
      </button>

      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto space-y-12 ">
        <div className="flex gap-10">
          <div
            className={`transition-all duration-300 ${
              showEpic ? "lg:w-1/3" : "w-0 overflow-hidden"
            }`}
          >
            {showEpic && (
              <Epic
                epicName={epicName}
                setEpicName={setEpicName}
                epics={epics}
                loading={epicLoading}
                handleEpicCreate={handleEpicCreate}
                setSelectedEpicId={setSelectedEpicId}
              />
            )}
          </div>

          <div
            className={`w-full transition-all duration-300 ${
              showEpic ? "lg:w-2/3" : "lg:w-full"
            }`}
          >
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
              selectedEpicId={selectedEpicId}
            />
          </div>

          
        </div>

        {/* ===== SPRINT Section ===== */}
        <section className=" p-6 lg:p-8 rounded-3xl shadow-md ">
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
        </section>
      </div>
    </div>
  );
};

export default ProductBacklog;
