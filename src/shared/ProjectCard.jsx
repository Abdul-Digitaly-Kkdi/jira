import React from 'react'
import { Card, Tag } from 'antd'

export default function ProjectCard({ project }) {
    return (
        <Card hoverable>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium">{project.name}</h3>
                    <p className="text-sm text-slate-500">{project.description}</p>
                </div>

                <div>
                    <Tag color={project.status === 'Active' ? 'green' : 'default'}>
                        {project.status}
                    </Tag>
                </div>
            </div>
        </Card>
    )
}
