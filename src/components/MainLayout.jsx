import React, { useEffect, useState } from "react";
import { Layout, Badge } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const mainSelected = location.pathname.startsWith("/projects")
    ? "projects"
    : location.pathname.startsWith("/employees")
    ? "employees"
    : "timetracking";

  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    setProjectList([
      { id: 1, name: "Website Redesign", tasks: 12 },
      { id: 2, name: "Mobile App UI", tasks: 8 },
      { id: 3, name: "E-commerce Upgrade", tasks: 5 },
    ]);
  }, []);

  const activeProjectId = location.pathname.startsWith("/projects/")
    ? location.pathname.split("/")[2]
    : null;

  return (
    <Layout className="app-shell">
      <Sider
        width={260}
        collapsedWidth={0}
        theme="light"
        className="
          min-h-screen p-5 
          bg-white 
          shadow-lg
          border-r border-gray-200
          !bg-white
        "
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
              className={`
                flex items-center w-full px-4 py-3 rounded-xl 
                transition-all text-left
                ${
                  mainSelected === item.key
                    ? "bg-indigo-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* PROJECTS */}
        {mainSelected === "projects" && (
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3 ml-1 tracking-wide">
                Your Projects
              </p>
              <p>
                <button className="bg-gray-200 rounded-full px-1 py-0.5"></button>
              </p>
            </div>

            <div className="space-y-2">
              {projectList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className={`
                    w-full px-4 py-3 rounded-xl 
                    flex justify-between items-center
                    transition-all text-left
                    ${
                      String(activeProjectId) === String(p.id)
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="font-medium">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Sider>

      {/* CONTENT */}
      <Layout>
        <Content className="p-8 bg-gray-50 min-h-screen">{children}</Content>
      </Layout>
    </Layout>
  );
}
