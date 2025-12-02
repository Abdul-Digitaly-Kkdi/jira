import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const list = [
            { id: 1, name: "Website Redesign", tasks: 12, desc: "Improving UI/UX" },
            { id: 2, name: "Mobile App UI", tasks: 8, desc: "New app screens" },
            { id: 3, name: "E-commerce Upgrade", tasks: 5, desc: "Adding new features" },
        ];

        const selected = list.find((p) => p.id === Number(id));
        setProject(selected);
    }, [id]);

    if (!project) return <p>Loading...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 p-80">{project.name}gfjfj</h1>
            <p className="mt-4 text-gray-600">{project.desc}</p>
        </div>
    );
}
