"use client"

import { useState, useEffect } from "react"
import ProjectTable from "@/components/projects/ProjectTable"
import ProjectModal from "@/components/projects/ProjectModal"

const STATUS_FILTERS = ["ALL", "ACTIVE", "COMPLETED", "ARCHIVED"]

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProject, setEditProject] = useState(null)

  const fetchProjects = async () => {
    setLoading(true)
    const res = await fetch("/api/projects")
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSuccess = (saved) => {
    if (editProject) {
      setProjects((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))
    } else {
      setProjects((prev) => [saved, ...prev])
    }
    setShowModal(false)
    setEditProject(null)
  }

  const handleEdit = (project) => {
    setEditProject(project)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return

    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setEditProject(null)
  }

  const filtered = filter === "ALL" ? projects : projects.filter((p) => p.status === filter)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 mt-1">{projects.length} total projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-50 text-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading projects...</div>
      ) : (
        <ProjectTable
          projects={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showModal && (
        <ProjectModal
          project={editProject}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      )}
    </div>
  )
}