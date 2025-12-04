import React, { useState } from "react";
import Board from "./Board";

export default function BoardIndex() {
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

  // ➡️ Add Column
  const handleAddColumn = (name) => {
    if (!name) return;
    const id = Date.now().toString();
    setColumns({
      ...columns,
      [id]: { id, title: name, tasks: [] },
    });
  };

  // ➡️ Add Task
  const handleAddTask = (columnId, taskText) => {
    const newTask = { id: Date.now().toString(), text: taskText || "New Task" };
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        tasks: [...columns[columnId].tasks, newTask],
      },
    });
  };

  // ➡️ Drag End
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newTasks = Array.from(column.tasks);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [column.id]: { ...column, tasks: newTasks },
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
  };

  // ➡️ Complete Sprint
  const handleCompleteSprint = () => alert("Sprint Completed! 🎉");

  return (
    <div>
      <Board
        columns={columns}
        setColumns={setColumns}
        handleAddColumn={handleAddColumn}
        handleAddTask={handleAddTask}
        handleDragEnd={handleDragEnd}
        handleCompleteSprint={handleCompleteSprint}
      />
    </div>
  );
}
