import React from "react";
import { Calendar, Layers, ListChecks } from "lucide-react";
import Epic from "./ProductBacklog/Epic";
import Sprint from "./ProductBacklog/Sprint";
import Backlog from "./ProductBacklog/Backlog";

const ProductBacklog = ({ projectId }) => {
  return (
    <div className="p-8 bg-gray-100  space-y-10">

      {/* Header */}

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Epic Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Epics</h2>
          </div>
          <Epic projectId={projectId} />
        </div>

        {/* Backlog Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <ListChecks className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Backlog Items</h2>
          </div>
          <Backlog projectId={projectId} />
        </div>

        {/* Sprint Section */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Sprints</h2>
          </div>
          <Sprint projectId={projectId} />
        </div>

      </div>
    </div>
  );
};

export default ProductBacklog;
