import React, { useEffect, useState } from "react";
import { getProjectById } from "../API/ProjectAPI";
import { Calendar, User, Users, Layers, Tag, Info } from "lucide-react";

export default function ProjectSummary({ projectId }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    async function fetchProject() {
        setLoading(true);
        try {
            const data = await getProjectById(projectId);
            setProject(data);
        } catch (err) {
            console.error("Error loading project:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return (
            <div className="p-6">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );

    if (!project)
        return (
            <div className="p-6">
                <p className="text-red-400">No project found</p>
            </div>
        );

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="bg-white/70 backdrop-blur-xl shadow-md rounded-2xl p-6 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Layers className="text-indigo-600" /> {project.name}
                </h1>
                <p className="mt-1 text-gray-500">Project Overview</p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                {/* Left Section */}
                <div className="space-y-6">

                    {/* Project Key */}
                    <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Tag /> <h2 className="text-lg font-semibold text-gray-700">Project Key</h2>
                        </div>
                        <p className="text-gray-900 text-xl mt-3 font-bold">{project.key}</p>
                    </div>

                    {/* Platform */}
                    <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Info /> <h2 className="text-lg font-semibold text-gray-700">Platform</h2>
                        </div>
                        <p className="text-gray-900 text-xl mt-3 font-semibold capitalize">
                            {project.platform}
                        </p>
                    </div>

                    {/* Dates */}
                    <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Calendar /> <h2 className="text-lg font-semibold text-gray-700">Timeline</h2>
                        </div>

                        <div className="mt-4 space-y-2">
                            <p><b>Start:</b> <span className="text-gray-700">{project.startDate}</span></p>
                            <p><b>End:</b> <span className="text-gray-700">{project.endDate}</span></p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="space-y-6">

                    {/* Lead */}
                    <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <User /> <h2 className="text-lg font-semibold text-gray-700">Project Lead</h2>
                        </div>
                        <p className="text-gray-900 text-xl mt-3 font-bold">
                            {project.projectLead?.full_name || "Not Assigned"}
                        </p>
                    </div>

                    {/* Assigned Employees */}
                    <div className="bg-white/70 backdrop-blur-xl p-5 shadow-md rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <Users /> <h2 className="text-lg font-semibold text-gray-700">Assigned Employees</h2>
                        </div>

                        <ul className="mt-4 space-y-2">
                            {project.assignedEmployees?.length > 0 ? (
                                project.assignedEmployees.map((emp) => (
                                    <li
                                        key={emp.id}
                                        className="text-gray-800 bg-gray-100 px-3 py-2 rounded-lg shadow-sm border border-gray-200"
                                    >
                                        {emp.full_name}
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No employees assigned</p>
                            )}
                        </ul>
                    </div>

                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white/70 backdrop-blur-xl p-6 shadow-md rounded-2xl mt-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">Description</h2>
                <p className="text-gray-800 mt-3 leading-relaxed">
                    {project.description || "No description added"}
                </p>
            </div>
        </div>
    );
}
