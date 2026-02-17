"use client"

import ProjectForm from "./ProjectForm"

export default function ProjectModal({ project, onSuccess, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {project ? "Edit Project" : "New Project"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>
        <ProjectForm project={project} onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </div>
  )
}