import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "antd";

export default function JiraBoard() {
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
            tasks: [
                { id: "3", text: "Task Three" },
            ],
        },
        done: {
            id: "done",
            title: "Done",
            tasks: [
                { id: "4", text: "Task Four" }
            ],
        },
    });

    function handleDragEnd(result) {
        const { source, destination } = result;
        if (!destination) return;

        // Same column drag
        if (source.droppableId === destination.droppableId) {
            const column = columns[source.droppableId];
            const newTasks = Array.from(column.tasks);
            const [moved] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, moved);

            setColumns({
                ...columns,
                [column.id]: {
                    ...column,
                    tasks: newTasks
                }
            });
            return;
        }

        // Different column drag
        const startColumn = columns[source.droppableId];
        const finishColumn = columns[destination.droppableId];

        const startTasks = Array.from(startColumn.tasks);
        const finishTasks = Array.from(finishColumn.tasks);

        const [moved] = startTasks.splice(source.index, 1);
        finishTasks.splice(destination.index, 0, moved);

        setColumns({
            ...columns,
            [startColumn.id]: { ...startColumn, tasks: startTasks },
            [finishColumn.id]: { ...finishColumn, tasks: finishTasks }
        });
    }

    return (
        <div className="flex gap-6 p-6 bg-gray-100 h-[80vh] overflow-auto">
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
                                                className={`
                                                    p-3 mb-3 rounded-md border shadow-sm 
                                                    bg-white cursor-pointer
                                                    ${snapshot.isDragging ? "bg-indigo-100" : ""}
                                                `}
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

                                {/* Add new task button */}
                                {/* <Button
                                    type="dashed"
                                    block
                                    className="mt-2"
                                    onClick={() => {
                                        const newTask = {
                                            id: String(Date.now()),
                                            text: "New Task"
                                        };
                                        setColumns({
                                            ...columns,
                                            [column.id]: {
                                                ...column,
                                                tasks: [...column.tasks, newTask]
                                            }
                                        });
                                    }}
                                >
                                    + Add Task
                                </Button> */}
                            </div>
                        )}
                    </Droppable>
                ))}
            </DragDropContext>
        </div>
    );
}
