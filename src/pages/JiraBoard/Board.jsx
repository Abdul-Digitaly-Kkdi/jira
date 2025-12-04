import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "antd";
import { Plus, CheckCircle } from "lucide-react";

export default function Board({
  columns,
  handleAddColumn,
  handleAddTask,
  handleDragEnd,
  handleCompleteSprint,
}) {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Board</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const name = prompt("Enter column name:");
              handleAddColumn(name);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Column
          </button>
          <button
            onClick={handleCompleteSprint}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Complete Sprint
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto">
          {Object.values(columns).map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-80 bg-white rounded-md shadow-md p-4"
                >
                  <h2 className="font-semibold text-lg mb-4">{column.title}</h2>

                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-3 rounded-md border shadow-sm ${
                            snapshot.isDragging ? "bg-indigo-100" : "bg-white"
                          }`}
                        >
                          {task.text}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  <button
                    onClick={() => handleAddTask(column.id)}
                    className="mt-2 w-full bg-gray-200 py-2 rounded-lg"
                  >
                    + Add Task
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

