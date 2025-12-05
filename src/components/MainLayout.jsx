import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { DoorClosed, LogOut, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { createProject, deleteProject, getAllProjects, getAllUsers } from "../API/ProjectAPI";

const { Sider, Content } = Layout;

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const mainSelected = location.pathname.startsWith("/projects")
    ? "projects"
    : location.pathname.startsWith("/employees")
    ? "employees"
    : "timetracking";

 const [newProject, setNewProject] = useState({
  assignedEmployees: [],
});

  const [users, setUsers] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // useEffect(() => {
  //   setNewProject([
  //   ]);
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const activeProjectId = location.pathname.startsWith("/projects/")
    ? location.pathname.split("/")[2]
    : null;

  const handleAddProject = async () => {
  try {
    const payload = {
      ...newProject,
      platform: newProject.platform?.toLowerCase(),  // 🔥 FIX
    };

    console.log("Final Payload:", payload);

    const res = await createProject(payload);

    console.log("Created", res.data);
    toast.success("Project created!");
    setShowProjectModal(false);

  } catch (error) {
    console.error("Failed to create project:", error);
  }
};

  const handleOut = () => {
    navigate("/");
  };
  
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjectList(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  fetchProjects();
}, []);


const handleDelete = async () => {
    try {
      const res = await deleteProject(activeProjectId);
      console.log("Deleted:", res);
      toast.success("Project Deleted Successfully!");
      setShowMenu(false);
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Delete failed!");
    }
  };



  return (
    <Layout className="app-shell">
      <Sider
        width={260}
        collapsedWidth={0}
        theme="light"
        className="`min`-h-screen p-5 bg-white shadow-lg border-r border-gray-200 flex flex-col justify-between"
      >
        {/* BRAND */}
        <div className="mb-10 flex items-center space-x-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
            D
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Digitaly</h1>
        </div>

        {/* MAIN MENU */}
        <div className="space-y-2">
          {[
            {
              key: "projects",
              icon: <ProjectOutlined />,
              label: "Projects",
              to: "/projects",
            },
            {
              key: "employees",
              icon: <TeamOutlined />,
              label: "Employee Management",
              to: "/employees",
            },
            {
              key: "timetracking",
              icon: <ClockCircleOutlined />,
              label: "Time Tracking",
              to: "/timetracking",
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.to)}
              className={`flex items-center w-full px-4 py-3 rounded-xl transition-all text-left ${
                mainSelected === item.key
                  ? "bg-indigo-500 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* PROJECTS */}

        {/* PROJECT LIST */}
        {mainSelected === "projects" && (
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3 ml-1 tracking-wide">
                Your Projects
              </p>

              <button
                className="font-bold rounded-full hover:scale-120 cursor-pointer"
                onClick={() => setShowProjectModal(true)}
              >
                <Plus size={13} />
              </button>
            </div>

            <div className="space-y-2">
              {projectList?.map(
                (
                  p 
                ) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className={`w-full px-4 py-3 rounded-xl flex justify-between items-center transition-all text-left ${
                      String(activeProjectId) === String(p.id)
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs font-mono opacity-70">
                      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-200 rounded-full"
      >
        <MoreHorizontal />
      </button></span>
                  </button>
                )
              )}
            </div>
          </div>
        )}
 {showMenu && (
        <div className="absolute right-10    p-2 z-50">
          <button
            onClick={handleDelete}
            className="w0 hover:scale-120 cursor-pointer   text-red-600"
          >
            <Trash2 size={25} /> 
          </button>
        </div>
      )}
        <div className="absolute bottom-5 left-5 right-5">
          <button
            onClick={handleOut}
            className="w-full flex items-center gap-3 p-3 font-bold text-center  rounded-lg bg-red-500 transition"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </Sider>

      {/* CONTENT */}
      <Layout>
        <Content className="p-8 bg-gray-50 min-h-screen flex flex-col">
  <div className="flex-1 overflow-y-auto">
    <Outlet />
  </div>
</Content>

      </Layout>

      {/* 🟣 PROJECT ADD MODAL */}
      {showProjectModal && (
        <Modal
          onCancel={() => setShowProjectModal(false)}
          onConfirm={handleAddProject}
        >
          <div className="flex flex-col max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-4">
            <h1 className="text-center text-2xl font-bold bg-clip-text text-transparent bg-linear-to-tr from-[#300181] via-[#6915cf] to-[#d62196] mb-6">
              Create New Project
            </h1>

            <div className="flex flex-col divide-y divide-gray-800">
              {/* -------- 1️⃣ Basic Details -------- */}
              <div className="space-y-5 pb-6">
                <h2 className="text-lg font-semibold text-blue-400">
                  1️⃣ Basic Details
                </h2>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black">Project Name</label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    className="p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                    value={newProject.name || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black">Project Key</label>
                  <input
                    type="text"
                    placeholder="Short Form"
                    className="p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                    value={newProject.key || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, key: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black">Avatar URL</label>
                  <input
                    type="text"
                    placeholder="Project profile"
                    className="p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                    value={newProject.avatar || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, avatar: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* -------- 2️⃣ Timeline & Team -------- */}
              <div className="space-y-5 py-6">
                <h2 className="text-lg font-semibold text-green-400">
                  2️⃣ Timeline & Team
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-black">Start Date</label>
                    <input
                      type="date"
                      className="p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                      value={newProject.startDate || ""}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-black">End Date</label>
                    <input
                      type="date"
                      className="p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
                      value={newProject.endDate || ""}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black">Project Lead</label>
                  <select
                    className="p-3 rounded-lg border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
                    value={newProject.projectLead || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        projectLead: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Lead</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Employees (Multi-select) */}
                {/* Assigned Employees (Multi-select) */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black">
                    Assigned Employees
                  </label>

                  {/* 🟦 Selected employees show box */}
                  {newProject.assignedEmployees?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newProject.assignedEmployees.map((id) => {
                        const emp = users.find((u) => u.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                          >
                            {emp?.full_name || "Unknown"}

                            {/* ❌ Remove button */}
                            <button
                              onClick={() =>
                                setNewProject({
                                  ...newProject,
                                  assignedEmployees:
                                    newProject.assignedEmployees.filter(
                                      (eid) => eid !== id
                                    ),
                                })
                              }
                              className="ml-2 text-red-400 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 🟦 Dropdown for selecting new employee */}
                  <select
                    className="p-3 rounded-lg border border-gray-700 text-gray-200 
    focus:border-blue-500 outline-none"
                    value=""
                    onChange={(e) => {
                      if (!e.target.value) return;

                      setNewProject({
                        ...newProject,
                        assignedEmployees: [
                          ...newProject.assignedEmployees,
                          e.target.value,
                        ],
                      });
                    }}
                  >
                    <option value="">Select Employee</option>

                    {users
                      .filter(
                        (u) =>
                          u.id !== newProject.projectLead && // ❌ exclude lead
                          !newProject.assignedEmployees?.includes(u.id) // ❌ exclude already selected
                      )
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} {u.full_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black">Platform</label>
              <select
  className="p-3 rounded-lg border border-gray-700 text-gray-200 focus:border-blue-500 outline-none"
  value={newProject.platform || ""}
  onChange={(e) =>
    setNewProject({ ...newProject, platform: e.target.value })
  }
>
  <option value="">Select Platform</option>
  <option value="web">Web</option>
  <option value="android">Android</option>
  <option value="ios">IOS</option>
</select>


                </div>
              </div>

              {/* -------- 3️⃣ Labels & Description -------- */}
              <div className="space-y-5 py-6">
                <h2 className="text-lg font-semibold text-pink-400">
                  3️⃣ Description
                </h2>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-black">Description</label>
                  <textarea
                    placeholder="Enter project description"
                    className="p-3 rounded-lg border border-gray-700 focus:border-blue-500 outline-none placeholder-gray-500 resize-none h-28"
                    value={newProject.description || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
