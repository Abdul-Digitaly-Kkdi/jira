import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "antd";
import { Plus, CheckCircle } from "lucide-react";

export default function Board() {
  const [columns, setColumns] = useState({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        { id: "1", text: "Task One" },
        { id: "2", text: "Task Two" },
      ],
    },
    inprogress: {
      id: "inprogress",
      title: "In Progress",
      tasks: [{ id: "3", text: "Task Three" }],
    },
    done: {
      id: "done",
      title: "Done",
      tasks: [{ id: "4", text: "Task Four" }],
    },
  });

  // 👉 ADD COLUMN
  const handleAddColumn = () => {
    const name = prompt("Enter column name:");
    if (!name) return;

    const id = Date.now().toString();

    setColumns({
      ...columns,
      [id]: {
        id,
        title: name,
        tasks: [],
      },
    });
  };

  // 👉 COMPLETE SPRINT
  const handleCompleteSprint = () => {
    alert("Sprint Completed! 🎉");
  };

  // 👉 DRAG END
  function handleDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newTasks = Array.from(column.tasks);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [column.id]: {
          ...column,
          tasks: newTasks,
        },
      });
      return;
    }

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    const startTasks = Array.from(startColumn.tasks);
    const finishTasks = Array.from(finishColumn.tasks);

    const [moved] = startTasks.splice(source.index, 1);
    finishTasks.splice(destination.index, 0, moved);

    setColumns({
      ...columns,
      [startColumn.id]: { ...startColumn, tasks: startTasks },
      [finishColumn.id]: { ...finishColumn, tasks: finishTasks },
    });
  }

  return (
    <div className="p-6 bg-gray-100 min-h-">

      {/* 🔥 TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Board</h1>

        <div className="flex gap-3">
          <button
            onClick={handleAddColumn}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add Column
          </button>

          <button
            onClick={handleCompleteSprint}
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            <CheckCircle size={18} /> Complete Sprint
          </button>
        </div>
      </div>

      {/* 🔥 BOARD */}
      <div className="flex gap-6 overflow-x-auto h-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.values(columns).map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-80 bg-white rounded-md shadow-md p-4"
                >
                  <h2 className="font-semibold text-lg mb-4">
                    {column.title}
                  </h2>

                  {column.tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`p-3 mb-3 rounded-md border shadow-sm 
                              bg-white cursor-pointer ${
                                snapshot.isDragging ? "bg-indigo-100" : ""
                              }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {task.text}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  {/* 🔥 ADD TASK BUTTON */}
                  <Button
                    type="dashed"
                    block
                    className="mt-2"
                    onClick={() => {
                      const newTask = {
                        id: String(Date.now()),
                        text: "New Task",
                      };
                      setColumns({
                        ...columns,
                        [column.id]: {
                          ...column,
                          tasks: [...column.tasks, newTask],
                        },
                      });
                    }}
                  >
                    + Add Task
                  </Button>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
