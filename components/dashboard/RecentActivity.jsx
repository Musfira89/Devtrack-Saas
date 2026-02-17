const statusColors = {
    TODO: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    DONE: "bg-green-100 text-green-700",
  }
  
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }
  
  export default function RecentActivity({ recentTasks }) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
  
        {recentTasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recent activity</p>
        ) : (
          <ul className="space-y-4">
            {recentTasks.map((task) => (
              <li key={task.id} className="flex items-start gap-4">
                <span className="text-2xl mt-1">📝</span>
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {task.project.name}
                    {task.assignee ? ` · @${task.assignee.name}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status]}`}>
                    {task.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-400">{timeAgo(task.updatedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }