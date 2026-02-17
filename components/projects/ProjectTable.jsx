"use client";

const statusColors = {
  ACTIVE: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-gray-100 text-gray-700",
};

export default function ProjectTable({ projects, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Project
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Client
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Tasks
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {projects.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-gray-400">
                No projects yet. Create your first project!
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium">{project.name}</p>
                  {project.description && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {project.description}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">{project.client.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      statusColors[project.status]
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {project._count?.tasks ?? 0}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
