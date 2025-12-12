import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  ChevronsUp,
  DoorClosed,
  LogOut,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import Modal from "./Modal";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getAllUsers,
} from "../API/ProjectAPI";
import ProjectForm from "../pages/ProjectForm";

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
  const [showProjects, setShowProjects] = useState(false);
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
        platform: newProject.platform?.toLowerCase(), // 🔥 FIX
      };

      console.log("Final Payload:", payload);

      const res = await createProject(payload);

      console.log("Created", res.data);
      toast.success("Project created Sucessfully !");
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
        className="h-screen p-5 bg-white shadow-lg border-r border-gray-200 flex flex-col justify-between"
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
                title="Create Project"
                onClick={() => setShowProjectModal(true)}
              >
                <Plus size={13} />
              </button>
            </div>
          
            <div
              className="w-full  mb-5 rounded-xl border border-gray-300 
             bg-white hover:bg-gray-100 transition-all flex justify-end 
              shadow-sm cursor-pointer"
              onClick={() => setShowProjects(!showProjects)}
            >
              <button className="p-2 rounded-lg flex  items-center">
                <span>Click To View</span>
                {showProjects ? (
                  <ChevronsUp className="transition-transform duration-300 rotate-180" />
                ) : (
                  <ChevronsUp className="transition-transform duration-300" />
                )}
                
              </button>
            </div>

            {showProjects && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {projectList?.map((p) => (
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <MoreHorizontal />
                    </button>
                  </button>
                ))}
              </div>
            )}
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
        <div className="bottom-2 absolute">
          <button
            onClick={handleOut}
            className="w-full  flex items-center gap-3 px-15 py-3 font-bold text-center rounded-lg bg-red-500 transition"
          >
            <LogOut />
            <span className="hidden md:flex text-md">Logout</span>
          </button>
        </div>
      </Sider>

      {/* CONTENT */}
      <Layout>
        <Content className="p-8 bg-gray-50 h-screen overflow-hidden flex flex-col">
          <div className="flex-1 ">
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
          <ProjectForm
            newProject={newProject}
            setNewProject={setNewProject}
            users={users}
            onSubmit={handleAddProject}
          />
        </Modal>
      )}
    </Layout>
  );
}
