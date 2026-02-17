import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StatsCards from "@/components/dashboard/StatsCards"
import Charts from "@/components/dashboard/Charts"
import RecentActivity from "@/components/dashboard/RecentActivity"
import { redirect } from "next/navigation"

async function getDashboardData(orgId) {
  const [totalProjects, activeProjects, totalTasks, completedTasks, timeEntries, members] =
    await Promise.all([
      prisma.project.count({ where: { organizationId: orgId } }),
      prisma.project.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
      prisma.task.count({ where: { project: { organizationId: orgId } } }),
      prisma.task.count({ where: { project: { organizationId: orgId }, status: "DONE" } }),
      prisma.timeEntry.findMany({
        where: { project: { organizationId: orgId }, duration: { not: null } },
        include: {
          project: { select: { name: true } },
          user: { select: { hourlyRate: true } },
        },
      }),
      prisma.user.count({ where: { organizationId: orgId } }),
    ])

  const totalMinutes = timeEntries.reduce((sum, e) => sum + (e.duration || 0), 0)
  const totalHours = Math.round(totalMinutes / 60)

  const totalRevenue = timeEntries.reduce((sum, e) => {
    const hours = (e.duration || 0) / 60
    const rate = e.user?.hourlyRate || 0
    return sum + hours * rate
  }, 0)

  const projectHoursMap = {}
  timeEntries.forEach((e) => {
    const name = e.project.name
    projectHoursMap[name] = (projectHoursMap[name] || 0) + (e.duration || 0) / 60
  })

  const projectHoursChart = Object.entries(projectHoursMap).map(([name, hours]) => ({
    name,
    hours: Math.round(hours),
  }))

  const recentTasks = await prisma.task.findMany({
    where: { project: { organizationId: orgId } },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      project: { select: { name: true } },
      assignee: { select: { name: true } },
    },
  })

  return {
    stats: {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      totalHours,
      totalRevenue: Math.round(totalRevenue),
      members,
    },
    projectHoursChart,
    recentTasks,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const data = await getDashboardData(session.user.organizationId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {session.user.name}!</p>
      </div>

      <StatsCards stats={data.stats} />
      <Charts projectHoursChart={data.projectHoursChart} />
      <RecentActivity recentTasks={data.recentTasks} />
    </div>
  )
}