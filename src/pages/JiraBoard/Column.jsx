import React from "react";
import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function Column({ column, columns, setColumns }) {
  const addTask = () => {
    const task = prompt("Enter task name:");
    if (!task) return;

    const newCols = columns.map((c) =>
      c.id === column.id ? { ...c, tasks: [...c.tasks, task] } : c
    );

    setColumns(newCols);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 min-w-[260px]">
      <h2 className="text-xl font-bold mb-3">{column.name}</h2>

      <SortableContext items={column.tasks} strategy={verticalListSortingStrategy}>
        {column.tasks.map((task) => (
          <TaskCard key={task} id={task} task={task} />
        ))}
      </SortableContext>

      <button
        onClick={addTask}
        className="mt-3 w-full bg-gray-200 text-gray-700 rounded-lg py-2"
      >
        + Add Task
      </button>
    </div>
  );
}
