"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function Charts({ projectHoursChart }) {
  if (!projectHoursChart.length) {
    return (
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Hours by Project</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No time entries yet
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Hours by Project</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={projectHoursChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
          <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}