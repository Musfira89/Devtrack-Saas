export default function StatsCards({ stats }) {
    const cards = [
      {
        label: "Total Projects",
        value: stats.totalProjects,
        sub: `${stats.activeProjects} active`,
        icon: "📁",
        color: "bg-blue-50 border-blue-200",
      },
      {
        label: "Total Tasks",
        value: stats.totalTasks,
        sub: `${stats.completedTasks} completed`,
        icon: "✅",
        color: "bg-green-50 border-green-200",
      },
      {
        label: "Hours Tracked",
        value: `${stats.totalHours}h`,
        sub: "All time",
        icon: "⏱️",
        color: "bg-yellow-50 border-yellow-200",
      },
      {
        label: "Revenue",
        value: `$${stats.totalRevenue.toLocaleString()}`,
        sub: "Total earned",
        icon: "💰",
        color: "bg-purple-50 border-purple-200",
      },
    ]
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`border rounded-xl p-6 ${card.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }