import React, { useEffect, useState } from 'react'
import { Tabs, Button } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import DragDropModal from '../shared/DragDropModal'
import ProjectSummary from './ProfileSummary'
import ProductBacklog from './ProductBacklog'
import BoardView from './BoardView'

const { TabPane } = Tabs

export default function ProjectsPage() {
    const { id } = useParams()   // ⭐ GET SLUG ID
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)

    const [activeTab, setActiveTab] = useState("Summary");
    const [ddVisible, setDdVisible] = useState(false);


    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        setLoading(true)
        try {
            const res = await axios.get('/api/projects')
            setProjects(res.data || sampleProjects())
        } catch (err) {
            setProjects(sampleProjects())
        } finally {
            setLoading(false)
        }
    }

    console.log(id, "124121");

    // ⭐ If NO ID → return simple demo screen
    if (!id) {
        return (
            <div className="p-6">
                <h2 className="text-3xl font-semibold text-gray-700">Our Projects</h2>
                <p className="text-gray-500 mt-2">Select any project from sidebar.</p>
            </div>
        )
    }

    // ⭐ If ID exists → show tabs
    return (
        <div className="space-y-6 p-2">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold"></h2>
                
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                type="card"
                className='flex'
            >
                <TabPane tab="Project Summary" key="Summary">
                    <ProjectSummary projectId={id} />
                </TabPane>

                <TabPane tab="Product Backlog Items" key=" Backlog ">
                     <ProductBacklog projectId={id} />
                </TabPane>

                <TabPane tab="Board" key="board">
                    <BoardView />
                </TabPane>

                <TabPane tab="Lists" key="Lists">
                    Lists management for project {id}
                </TabPane>

                <TabPane tab="Goals" key="Goals">
                    Goals management for project {id}
                </TabPane>

                <TabPane tab="Archieved Items" key="Archieved">
                    Archieved management for project {id}
                </TabPane>

                
            </Tabs>


        </div>
    )
}

/* fallback mock */
function sampleProjects() {
    return Array.from({ length: 12 }).map((_, i) => ({
        id: `${i + 1}`,
        name: `Project ${i + 1}`,
        description: `Short description for project ${i + 1}`,
        status: i % 3 === 0 ? "Active" : "Planned",
    }))
}
